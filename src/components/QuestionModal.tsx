import React, { useState } from 'react';
import { QuizQuestion } from '../types/quiz';
import {
  DEFAULT_QUESTIONS,
  QUESTION_IMAGE_PRESETS,
  OPTION_IMAGE_PRESETS,
  QUIZ_TOPICS,
  filterQuestionsByTopic
} from '../data/defaultQuestions';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Check,
  Image as ImageIcon,
  Upload,
  Edit3,
  Sparkles,
  Tag,
  Filter,
  Play
} from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  onSaveQuestions: (questions: QuizQuestion[]) => void;
  selectedTopic?: string;
  onSelectTopic?: (topicId: string) => void;
  isMarathi: boolean;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaveQuestions,
  selectedTopic = 'all',
  onSelectTopic,
  isMarathi
}) => {
  const [list, setList] = useState<QuizQuestion[]>(questions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFilterTopic, setActiveFilterTopic] = useState<string>('all');

  // New/Edit question form state
  const [newQMr, setNewQMr] = useState('');
  const [newQEn, setNewQEn] = useState('');
  const [newQImg, setNewQImg] = useState('');
  const [opt0Mr, setOpt0Mr] = useState('');
  const [opt1Mr, setOpt1Mr] = useState('');
  const [opt2Mr, setOpt2Mr] = useState('');
  const [opt3Mr, setOpt3Mr] = useState('');
  const [optImg0, setOptImg0] = useState('');
  const [optImg1, setOptImg1] = useState('');
  const [optImg2, setOptImg2] = useState('');
  const [optImg3, setOptImg3] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [topicId, setTopicId] = useState('gk');
  const [category, setCategory] = useState('सामान्य ज्ञान');
  const [timeLimit, setTimeLimit] = useState(20);

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingId(null);
    setNewQMr('');
    setNewQEn('');
    setNewQImg('');
    setOpt0Mr('');
    setOpt1Mr('');
    setOpt2Mr('');
    setOpt3Mr('');
    setOptImg0('');
    setOptImg1('');
    setOptImg2('');
    setOptImg3('');
    setCorrectIdx(0);
    setTopicId('gk');
    setCategory('सामान्य ज्ञान');
    setTimeLimit(20);
    setShowAddForm(false);
  };

  const handleStartEdit = (q: QuizQuestion) => {
    setEditingId(q.id);
    setNewQMr(q.questionMr);
    setNewQEn(q.questionEn && q.questionEn !== q.questionMr ? q.questionEn : '');
    setNewQImg(q.imageUrl || '');
    setOpt0Mr(q.optionsMr[0] || '');
    setOpt1Mr(q.optionsMr[1] || '');
    setOpt2Mr(q.optionsMr[2] || '');
    setOpt3Mr(q.optionsMr[3] || '');
    setOptImg0(q.optionImages?.[0] || '');
    setOptImg1(q.optionImages?.[1] || '');
    setOptImg2(q.optionImages?.[2] || '');
    setOptImg3(q.optionImages?.[3] || '');
    setCorrectIdx(q.correctIndex);
    setTopicId(q.topicId || 'gk');
    setCategory(q.categoryMr || 'सामान्य ज्ञान');
    setTimeLimit(q.timeLimit || 20);
    setShowAddForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(isMarathi ? 'कृपया २ MB पेक्षा लहान फोटो निवडा' : 'Please select an image smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewQImg(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOptionImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(isMarathi ? 'कृपया २ MB पेक्षा लहान फोटो निवडा' : 'Please select an image smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const val = event.target.result as string;
        if (index === 0) setOptImg0(val);
        else if (index === 1) setOptImg1(val);
        else if (index === 2) setOptImg2(val);
        else if (index === 3) setOptImg3(val);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectTopicInForm = (tId: string) => {
    setTopicId(tId);
    const found = QUIZ_TOPICS.find((t) => t.id === tId);
    if (found) {
      setCategory(found.nameMr);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQMr.trim() || !opt0Mr.trim() || !opt1Mr.trim() || !opt2Mr.trim() || !opt3Mr.trim()) {
      alert(isMarathi ? 'कृपया प्रश्न आणि सर्व ४ पर्याय भरा' : 'Please fill the question and all 4 options');
      return;
    }

    const hasAnyOptImg = Boolean(optImg0 || optImg1 || optImg2 || optImg3);
    const optionImages: [string | undefined, string | undefined, string | undefined, string | undefined] | undefined = hasAnyOptImg
      ? [
          optImg0.trim() || undefined,
          optImg1.trim() || undefined,
          optImg2.trim() || undefined,
          optImg3.trim() || undefined
        ]
      : undefined;

    const questionData: QuizQuestion = {
      id: editingId || `custom-${Date.now()}`,
      topicId: topicId || 'gk',
      questionMr: newQMr,
      questionEn: newQEn || newQMr,
      imageUrl: newQImg.trim() || undefined,
      optionsMr: [opt0Mr, opt1Mr, opt2Mr, opt3Mr],
      optionsEn: [opt0Mr, opt1Mr, opt2Mr, opt3Mr],
      optionImages,
      correctIndex: correctIdx,
      categoryMr: category,
      categoryEn: category,
      timeLimit: Number(timeLimit) || 20
    };

    let updated: QuizQuestion[];
    if (editingId) {
      updated = list.map((item) => (item.id === editingId ? questionData : item));
    } else {
      updated = [...list, questionData];
    }

    setList(updated);
    onSaveQuestions(updated);
    resetForm();
  };

  const handleDelete = (idOrIndex: string | number) => {
    if (list.length <= 1) {
      alert(isMarathi ? 'किमान १ प्रश्न असणे आवश्यक आहे!' : 'At least 1 question is required!');
      return;
    }
    const updated = typeof idOrIndex === 'string'
      ? list.filter((q) => q.id !== idOrIndex)
      : list.filter((_, i) => i !== idOrIndex);
    setList(updated);
    onSaveQuestions(updated);
  };

  const handleResetToDefault = () => {
    setList(DEFAULT_QUESTIONS);
    onSaveQuestions(DEFAULT_QUESTIONS);
  };

  const displayedQuestions = filterQuestionsByTopic(list, activeFilterTopic);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 text-2xl">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>{isMarathi ? 'प्रश्न, चित्रे व विषय व्यवस्थापन' : 'Topic & Question Management'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {isMarathi ? 'विषयानुसार खेळ' : 'Topic-Wise'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isMarathi
                  ? `एकूण प्रश्न: ${list.length} • विविध विषयांचे प्रश्न संच निवडा किंवा नवीन जोडा`
                  : `Total Questions: ${list.length} • Select topic packages or add new custom questions`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => {
                if (showAddForm && !editingId) {
                  setShowAddForm(false);
                } else {
                  resetForm();
                  setShowAddForm(true);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/30 text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isMarathi ? 'नवीन प्रश्न व चित्रे जोडा' : 'Add New Question & Images'}
            </button>

            <button
              onClick={handleResetToDefault}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              {isMarathi ? 'डीफॉल्ट विषयवार प्रश्न पुनर्स्थापित करा' : 'Reset to Default Question Bank'}
            </button>
          </div>

          {/* Form to add or edit question */}
          {showAddForm && (
            <form onSubmit={handleAddQuestion} className="p-5 sm:p-6 bg-slate-950/90 rounded-3xl border-2 border-indigo-500/40 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-indigo-300 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {editingId
                      ? (isMarathi ? 'प्रश्न, चित्रे व विषय संपादित करा' : 'Edit Question, Images & Topic')
                      : (isMarathi ? 'नवीन प्रश्न व चित्रे तयार करा' : 'Create New Question & Images')}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
                >
                  ✕ {isMarathi ? 'बंद करा' : 'Close'}
                </button>
              </div>

              {/* Topic Selector for Question */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  🎯 {isMarathi ? 'प्रश्नाचा विषय निवडा (Select Topic):' : 'Select Topic:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {QUIZ_TOPICS.filter((t) => t.id !== 'all').map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTopicInForm(t.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                        topicId === t.id
                          ? 'bg-indigo-600/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{t.icon}</span>
                      <span className="truncate">{isMarathi ? t.nameMr.split(' ')[0] : t.nameEn.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Marathi Question Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isMarathi ? 'प्रश्न (मराठी) * :' : 'Question (Marathi) * :'}
                </label>
                <textarea
                  value={newQMr}
                  onChange={(e) => setNewQMr(e.target.value)}
                  placeholder="उदा. छत्रपती शिवाजी महाराजांचा जन्म कोणत्या किल्ल्यावर झाला?"
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* English Question Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  {isMarathi ? 'प्रश्न (English - पर्यायी):' : 'Question (English - Optional):'}
                </label>
                <input
                  type="text"
                  value={newQEn}
                  onChange={(e) => setNewQEn(e.target.value)}
                  placeholder="e.g. On which fort was Shivaji Maharaj born?"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Question Image Section */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span>{isMarathi ? 'प्रश्नासाठी मुख्य चित्र (Question Image - पर्यायी):' : 'Main Question Image (Optional):'}</span>
                  </label>
                  {newQImg && (
                    <button
                      type="button"
                      onClick={() => setNewQImg('')}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      {isMarathi ? 'फोटो काढा' : 'Remove Image'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newQImg}
                    onChange={(e) => setNewQImg(e.target.value)}
                    placeholder="https://... फोटोची लिंक टाका"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer shrink-0 flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isMarathi ? 'फोटो अपलोड' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset suggestions */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    {isMarathi ? 'किंवा तयार शैक्षणिक चित्रे निवडा:' : 'Or choose preset educational images:'}
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                    {QUESTION_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewQImg(preset.url)}
                        className={`text-xs px-2.5 py-1 rounded-lg border shrink-0 transition cursor-pointer ${
                          newQImg === preset.url
                            ? 'bg-indigo-600 border-indigo-400 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnail Preview */}
                {newQImg && (
                  <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <img
                      src={newQImg}
                      alt="Question Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-700 bg-slate-900"
                    />
                    <span className="text-xs text-emerald-400 font-bold">
                      ✓ {isMarathi ? 'प्रश्नाचा फोटो जोडला गेला आहे' : 'Question image attached'}
                    </span>
                  </div>
                )}
              </div>

              {/* 4 Options Grid with Option Images */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    {isMarathi ? '४ पर्याय आणि त्यांची चित्रे (Options & Option Images):' : '4 Options & Option Images:'}
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {isMarathi ? 'अचूक उत्तराच्या पर्यायावर गोल टिक करा 🟢' : 'Select radio for correct answer'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'पर्याय १ (A)', val: opt0Mr, setVal: setOpt0Mr, img: optImg0, setImg: setOptImg0, idx: 0, color: 'text-rose-400 border-rose-500/30' },
                    { label: 'पर्याय २ (B)', val: opt1Mr, setVal: setOpt1Mr, img: optImg1, setImg: setOptImg1, idx: 1, color: 'text-blue-400 border-blue-500/30' },
                    { label: 'पर्याय ३ (C)', val: opt2Mr, setVal: setOpt2Mr, img: optImg2, setImg: setOptImg2, idx: 2, color: 'text-amber-400 border-amber-500/30' },
                    { label: 'पर्याय ४ (D)', val: opt3Mr, setVal: setOpt3Mr, img: optImg3, setImg: setOptImg3, idx: 3, color: 'text-emerald-400 border-emerald-500/30' }
                  ].map(({ label, val, setVal, img, setImg, idx, color }) => (
                    <div
                      key={idx}
                      className={`p-3.5 bg-slate-900/90 rounded-2xl border-2 space-y-2.5 transition ${
                        correctIdx === idx ? 'border-emerald-500 shadow-md shadow-emerald-500/20 bg-slate-900' : color
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-white">
                          <input
                            type="radio"
                            name="correctOption"
                            checked={correctIdx === idx}
                            onChange={() => setCorrectIdx(idx)}
                            className="w-4 h-4 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                          />
                          <span>{label}</span>
                        </label>
                        {correctIdx === idx && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✓ {isMarathi ? 'अचूक उत्तर' : 'Correct Answer'}
                          </span>
                        )}
                      </div>

                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        placeholder={`पर्याय ${idx + 1} चे नाव...`}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        required
                      />

                      {/* Option Image Attachment */}
                      <div className="pt-1 border-t border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-bold text-slate-300">
                            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                            {isMarathi ? 'पर्यायाचा फोटो (Option Image):' : 'Option Image:'}
                          </span>
                          {img && (
                            <button
                              type="button"
                              onClick={() => setImg('')}
                              className="text-rose-400 hover:underline cursor-pointer font-bold"
                            >
                              {isMarathi ? 'काढा ✕' : 'Remove ✕'}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="url"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                            placeholder="https://... किंवा फोटो निवडा"
                            className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-[11px] focus:outline-none"
                          />
                          <label className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg border border-slate-700 cursor-pointer shrink-0 flex items-center gap-1 transition">
                            <Upload className="w-3 h-3 text-indigo-400" />
                            <span>{isMarathi ? 'अपलोड' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleOptionImageUpload(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Quick Presets for this option */}
                        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                          <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                            {isMarathi ? 'नमुने:' : 'Presets:'}
                          </span>
                          {OPTION_IMAGE_PRESETS.slice(0, 6).map((optPre, opIdx) => (
                            <button
                              key={opIdx}
                              type="button"
                              onClick={() => setImg(optPre.url)}
                              className={`text-[10px] px-2 py-0.5 rounded-md border shrink-0 transition cursor-pointer ${
                                img === optPre.url
                                  ? 'bg-indigo-600 border-indigo-400 text-white font-bold'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {optPre.label.split(' ')[0]}
                            </button>
                          ))}
                        </div>

                        {/* Option Image Thumbnail Preview */}
                        {img && (
                          <div className="flex items-center gap-2.5 p-2 bg-slate-950 rounded-xl border border-indigo-500/30">
                            <img
                              src={img}
                              alt={`Preview ${idx + 1}`}
                              className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-900 shrink-0 shadow"
                            />
                            <div className="min-w-0">
                              <span className="text-[11px] text-emerald-400 font-bold block truncate">
                                ✓ {isMarathi ? 'पर्यायाचे चित्र जोडले गेले' : 'Option image attached'}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {isMarathi ? 'विद्यार्थ्यांच्या बटणावर हे चित्र दिसेल' : 'Will appear on student button'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category and Time Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isMarathi ? 'विषय / श्रेणी शीर्षक:' : 'Category Title:'}
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isMarathi ? 'वेळ मर्यादा (सेकंद):' : 'Time Limit (Seconds):'}
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition cursor-pointer"
                >
                  {isMarathi ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  {editingId
                    ? (isMarathi ? 'बदल जतन करा (Save Changes)' : 'Save Changes')
                    : (isMarathi ? 'प्रश्न जोडा (Add Question)' : 'Add Question')}
                </button>
              </div>
            </form>
          )}

          {/* TOPIC FILTER TABS FOR TEACHER */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isMarathi ? 'विषयानुसार प्रश्न फिल्टर करा / निवडा:' : 'Filter & Select Topic:'}
                </h3>
              </div>
              {onSelectTopic && activeFilterTopic !== 'all' && (
                <button
                  onClick={() => onSelectTopic(activeFilterTopic)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {isMarathi ? 'हा विषय सध्याच्या खेळासाठी लागू करा' : 'Set as Active Game Topic'}
                  </span>
                </button>
              )}
            </div>

            {/* Topic Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {QUIZ_TOPICS.map((topic) => {
                const isSelected = activeFilterTopic === topic.id;
                const count = filterQuestionsByTopic(list, topic.id).length;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setActiveFilterTopic(topic.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{topic.icon}</span>
                    <span>{isMarathi ? topic.nameMr.split(' ')[0] : topic.nameEn.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-900/80 text-[10px] text-slate-300 font-mono">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Existing Question List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">
                {isMarathi
                  ? `दाखवत असलेले प्रश्न (${displayedQuestions.length} / एकूण ${list.length})`
                  : `Showing (${displayedQuestions.length} of ${list.length})`}
              </span>
            </div>

            {displayedQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 sm:p-5 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-2xl transition flex items-start justify-between gap-4 shadow-md"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Question Image Thumbnail if available */}
                  {q.imageUrl ? (
                    <div className="relative group shrink-0">
                      <img
                        src={q.imageUrl}
                        alt="Question Thumbnail"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 bg-slate-900 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-[9px] font-bold text-white shadow">
                        📸
                      </span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center shrink-0 font-bold text-sm">
                      #{idx + 1}
                    </div>
                  )}

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {q.categoryMr}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ⏱️ {q.timeLimit}s
                      </span>
                      {q.imageUrl && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-bold">
                          <ImageIcon className="w-3 h-3 text-indigo-400" />
                          {isMarathi ? 'प्रश्नात फोटो' : 'Question Image'}
                        </span>
                      )}
                      {q.optionImages && q.optionImages.some(Boolean) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                          🖼️ {isMarathi ? 'पर्यायांची चित्रे' : 'Option Images'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-white font-bold text-base leading-snug">
                      {q.questionMr}
                    </h4>

                    {q.questionEn && q.questionEn !== q.questionMr && (
                      <p className="text-xs text-slate-400 italic">{q.questionEn}</p>
                    )}

                    {/* 4 Options with Small Image Thumbnails */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.optionsMr.map((opt, oIdx) => {
                        const optImg = q.optionImages ? q.optionImages[oIdx] : undefined;
                        const isCorrect = oIdx === q.correctIndex;
                        return (
                          <div
                            key={oIdx}
                            className={`text-xs px-3 py-1.5 rounded-xl flex items-center gap-2.5 ${
                              isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                                : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
                            }`}
                          >
                            {optImg ? (
                              <img
                                src={optImg}
                                alt="opt"
                                className="w-7 h-7 object-cover rounded-lg border border-white/20 shrink-0 bg-slate-950 shadow-sm"
                              />
                            ) : (
                              <span className="w-5 h-5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                                {oIdx + 1}
                              </span>
                            )}
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            <span className="truncate flex-1">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(q)}
                    className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600/20 rounded-xl transition cursor-pointer"
                    title={isMarathi ? 'प्रश्न व चित्रे संपादित करा' : 'Edit Question & Images'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                    title={isMarathi ? 'प्रश्न हटवा' : 'Delete Question'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            💡 {isMarathi ? 'शिक्षकांसाठी: आपण कोणत्याही विषयानुसार खेळ सुरू करू शकता.' : 'Teachers can launch games customized by specific topics.'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            {isMarathi ? 'पूर्ण झाले (Done)' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
