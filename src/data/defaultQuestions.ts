import { QuizQuestion, QuizTopic } from '../types/quiz';
import {
  createFractionCircleSvg,
  createFractionBarSvg,
  createBalanceScaleSvg
} from '../utils/fractionVisuals';

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: 'all',
    nameMr: 'सर्व विषय (मिश्र)',
    nameEn: 'All Topics (Mixed)',
    icon: '🌟',
    color: 'amber',
    bgGradient: 'from-amber-500 via-rose-500 to-indigo-600',
    descriptionMr: 'सर्व विषयांचे मिळून दर्जेदार मिश्र प्रश्न',
    descriptionEn: 'Carefully mixed questions from all topics'
  },
  {
    id: 'fractions',
    nameMr: 'गणित: अपूर्णांक (पातळी १ ते ९)',
    nameEn: 'Math: Fractions (Levels 1 to 9)',
    icon: '🍰',
    color: 'rose',
    bgGradient: 'from-amber-500 via-rose-500 to-indigo-600',
    descriptionMr: 'पायाभूत ओळख, सममूल्य, स्वयं-मूल्यमापन, डिजिटल तराजू तुलना व प्रकार',
    descriptionEn: 'Basic Concept, Equivalent, Auto-Evaluation, Balance Scale & Types'
  },
  {
    id: 'math',
    nameMr: 'गणित व बुद्धिमत्ता',
    nameEn: 'Math & Logic',
    icon: '📐',
    color: 'violet',
    bgGradient: 'from-violet-500 to-purple-600',
    descriptionMr: 'संख्याज्ञान, पाढे, वेळ, भूमिती व आकडेमोड',
    descriptionEn: 'Arithmetic, time, geometry & logic'
  },
  {
    id: 'history',
    nameMr: 'इतिहास व किल्ले',
    nameEn: 'History & Forts',
    icon: '🏰',
    color: 'orange',
    bgGradient: 'from-orange-500 to-amber-600',
    descriptionMr: 'छत्रपती शिवाजी महाराज, किल्ले व स्वातंत्र्यलढा',
    descriptionEn: 'Chhatrapati Shivaji Maharaj, Forts & Freedom Movement'
  },
  {
    id: 'geography',
    nameMr: 'भूगोल व महाराष्ट्र',
    nameEn: 'Geography & Maharashtra',
    icon: '🌍',
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-teal-600',
    descriptionMr: 'महाराष्ट्र, नद्या, शिखरे, जिल्हे व भारत',
    descriptionEn: 'Maharashtra, rivers, peaks, districts & India'
  },
  {
    id: 'science',
    nameMr: 'विज्ञान व अंतराळ',
    nameEn: 'Science & Space',
    icon: '🔬',
    color: 'cyan',
    bgGradient: 'from-cyan-500 to-blue-600',
    descriptionMr: 'सूर्यमाला, भौतिक, रसायन, वनस्पती व मानवी शरीर',
    descriptionEn: 'Solar system, physics, chemistry & biology'
  },
  {
    id: 'wildlife',
    nameMr: 'पर्यावरण व वन्यजीव',
    nameEn: 'Wildlife & Nature',
    icon: '🦁',
    color: 'green',
    bgGradient: 'from-green-500 to-emerald-600',
    descriptionMr: 'राष्ट्रीय प्राणी, पक्षी, निसर्ग व पर्यावरण',
    descriptionEn: 'National animals, birds & nature'
  },
  {
    id: 'gk',
    nameMr: 'सामान्य ज्ञान (GK)',
    nameEn: 'General Knowledge',
    icon: '🧠',
    color: 'rose',
    bgGradient: 'from-rose-500 to-pink-600',
    descriptionMr: 'राष्ट्रध्वज, राष्ट्रगीत, चालू घडामोडी व माहिती',
    descriptionEn: 'National symbols, anthems & facts'
  },
  {
    id: 'technology',
    nameMr: 'संगणक व तंत्रज्ञान',
    nameEn: 'Tech & Computers',
    icon: '💻',
    color: 'indigo',
    bgGradient: 'from-indigo-500 to-blue-600',
    descriptionMr: 'CPU, इंटरनेट, कीबोर्ड व डिजिटल तंत्रज्ञान',
    descriptionEn: 'Computer hardware, internet & digital skills'
  }
];

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  // --- इतिहास व किल्ले (History & Forts) ---
  {
    id: 'hist_1',
    topicId: 'history',
    questionMr: 'छत्रपती शिवाजी महाराजांचा जन्म कोणत्या किल्ल्यावर झाला?',
    questionEn: 'On which fort was Chhatrapati Shivaji Maharaj born?',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['रायगड', 'शिवनेरी', 'प्रतापगड', 'तोरणा'],
    optionsEn: ['Raigad', 'Shivneri', 'Pratapgad', 'Torna'],
    correctIndex: 1,
    categoryMr: 'इतिहास व किल्ले',
    categoryEn: 'History & Forts',
    explanationMr: 'छत्रपती शिवाजी महाराजांचा जन्म १९ फेब्रुवारी १६३० रोजी पुणे जिल्ह्यातील जुन्नर जवळील शिवनेरी किल्ल्यावर झाला.',
    explanationEn: 'Shivaji Maharaj was born on 19 Feb 1630 at Shivneri fort near Junnar.',
    timeLimit: 20
  },
  {
    id: 'hist_2',
    topicId: 'history',
    questionMr: 'छत्रपती शिवाजी महाराजांचा भव्य राज्याभिषेक सोहळा कोणत्या किल्ल्यावर संपन्न झाला?',
    questionEn: 'On which fort was the grand coronation of Chhatrapati Shivaji Maharaj held?',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['पन्हाळा', 'शिवनेरी', 'रायगड', 'सिंहगड'],
    optionsEn: ['Panhala', 'Shivneri', 'Raigad', 'Sinhagad'],
    correctIndex: 2,
    categoryMr: 'इतिहास व किल्ले',
    categoryEn: 'History & Forts',
    explanationMr: '६ जून १६७४ रोजी किल्ले रायगडावर छत्रपती शिवाजी महाराजांचा शिवराज्याभिषेक सोहळा संपन्न झाला आणि ते छत्रपती झाले.',
    explanationEn: 'The coronation of Shivaji Maharaj took place on 6 June 1674 at Raigad fort.',
    timeLimit: 20
  },
  {
    id: 'hist_3',
    topicId: 'history',
    questionMr: '"स्वराज्य हा माझा जन्मसिद्ध हक्क आहे आणि तो मी मिळवणारच!" ही सिंहगर्जना कोणी केली?',
    questionEn: '"Swaraj is my birthright and I shall have it!" - Who gave this slogan?',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['लोकमान्य टिळक', 'महात्मा गांधी', 'भगतसिंग', 'सुभाषचंद्र बोस'],
    optionsEn: ['Lokmanya Tilak', 'Mahatma Gandhi', 'Bhagat Singh', 'Subhash Chandra Bose'],
    correctIndex: 0,
    categoryMr: 'इतिहास व स्वातंत्र्यलढा',
    categoryEn: 'History & Freedom Movement',
    explanationMr: 'लोकमान्य बाळ गंगाधर टिळक यांनी भारतीय स्वातंत्र्यलढ्यात ही प्रसिद्ध सिंहगर्जना करून जनतेत राष्ट्रभक्ती जागवली.',
    explanationEn: 'Lokmanya Bal Gangadhar Tilak proclaimed this famous patriotic slogan.',
    timeLimit: 20
  },
  {
    id: 'hist_4',
    topicId: 'history',
    questionMr: 'हिंदवी स्वराज्याची पहिली राजधानी कोणती होती?',
    questionEn: 'Which was the first capital of Hindavi Swarajya?',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['राजगड', 'तोरणा', 'रायगड', 'प्रतापगड'],
    optionsEn: ['Rajgad', 'Torna', 'Raigad', 'Pratapgad'],
    correctIndex: 0,
    categoryMr: 'इतिहास व किल्ले',
    categoryEn: 'History & Forts',
    explanationMr: 'किल्ले राजगड ही छत्रपती शिवाजी महाराजांच्या हिंदवी स्वराज्याची पहिली राजधानी होती (जवळपास २५ वर्षे).',
    explanationEn: 'Fort Rajgad served as the first capital of Hindavi Swarajya for nearly 25 years.',
    timeLimit: 20
  },

  // --- भूगोल व महाराष्ट्र (Geography & Maharashtra) ---
  {
    id: 'geo_1',
    topicId: 'geography',
    questionMr: 'महाराष्ट्राची उपराजधानी (हिवाळी राजधानी) कोणती आहे?',
    questionEn: 'Which is the sub-capital (winter capital) of Maharashtra?',
    imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['पुणे', 'नाशिक', 'नागपूर', 'छत्रपती संभाजीनगर'],
    optionsEn: ['Pune', 'Nashik', 'Nagpur', 'Chhatrapati Sambhajinagar'],
    correctIndex: 2,
    categoryMr: 'भूगोल व महाराष्ट्र',
    categoryEn: 'Geography & Maharashtra',
    explanationMr: 'नागपूर ही महाराष्ट्राची उपराजधानी असून येथे दरवर्षी राज्य विधिमंडळाचे हिवाळी अधिवेशन भरते.',
    explanationEn: 'Nagpur is the winter/sub-capital of Maharashtra.',
    timeLimit: 20
  },
  {
    id: 'geo_2',
    topicId: 'geography',
    questionMr: 'महाराष्ट्रातील सर्वोच्च पर्वत शिखर कोणते आहे?',
    questionEn: 'Which is the highest mountain peak in Maharashtra?',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['कळसुबाई', 'साल्हेर', 'महाबळेश्वर', 'हरिश्चंद्रगड'],
    optionsEn: ['Kalsubai', 'Salher', 'Mahabaleshwar', 'Harishchandragad'],
    correctIndex: 0,
    categoryMr: 'भूगोल व महाराष्ट्र',
    categoryEn: 'Geography & Maharashtra',
    explanationMr: 'कळसुबाई शिखर हे अहमदनगर जिल्ह्यातील अकोले तालुक्यात असून त्याची उंची १६४६ मीटर आहे.',
    explanationEn: 'Kalsubai (1646m) is the highest peak in Maharashtra.',
    timeLimit: 20
  },
  {
    id: 'geo_3',
    topicId: 'geography',
    questionMr: 'महाराष्ट्रातील सर्वात लांब व प्रमुख नदी कोणती आहे, जिला "दक्षिण गंगा" म्हणतात?',
    questionEn: 'Which is the longest and most prominent river of Maharashtra, known as "Dakshin Ganga"?',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['कृष्णा नदी', 'गोदावरी नदी', 'भीमा नदी', 'तापी नदी'],
    optionsEn: ['Krishna River', 'Godavari River', 'Bhima River', 'Tapi River'],
    correctIndex: 1,
    categoryMr: 'भूगोल व नद्या',
    categoryEn: 'Geography & Rivers',
    explanationMr: 'गोदावरी नदीचा उगम त्र्यंबकेश्वर (नाशिक) येथे होतो आणि ती महाराष्ट्रातील सर्वात मोठी नदी आहे.',
    explanationEn: 'Godavari originates at Trimbakeshwar (Nashik) and is the longest river in Maharashtra.',
    timeLimit: 20
  },
  {
    id: 'geo_4',
    topicId: 'geography',
    questionMr: 'भारताची राजधानी कोणती आहे?',
    questionEn: 'What is the national capital of India?',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['मुंबई', 'कोलकाता', 'नवी दिल्ली', 'चेन्नई'],
    optionsEn: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'],
    correctIndex: 2,
    categoryMr: 'भूगोल व भारत',
    categoryEn: 'Geography & India',
    explanationMr: 'नवी दिल्ली ही भारताची राजधानी असून येथे संसद भवन आणि राष्ट्रपती भवन स्थित आहे.',
    explanationEn: 'New Delhi is the official national capital of India.',
    timeLimit: 15
  },

  // --- विज्ञान व अंतराळ (Science & Space) ---
  {
    id: 'sci_1',
    topicId: 'science',
    questionMr: 'सूर्यमालेतील सर्वात मोठा ग्रह कोणता आहे?',
    questionEn: 'Which is the largest planet in our Solar System?',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['पृथ्वी (Earth)', 'मंगळ (Mars)', 'गुरु (Jupiter)', 'शनि (Saturn)'],
    optionsEn: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctIndex: 2,
    categoryMr: 'विज्ञान व अंतराळ',
    categoryEn: 'Science & Space',
    explanationMr: 'गुरु (Jupiter) हा आपल्या सूर्यमालेतील सर्वात मोठा ग्रह असून तो वायूचा महाकाय गोळा आहे.',
    explanationEn: 'Jupiter is the largest planet in our solar system.',
    timeLimit: 20
  },
  {
    id: 'sci_2',
    topicId: 'science',
    questionMr: 'पाण्याचे रासायनिक सूत्र (Chemical Formula of Water) काय आहे?',
    questionEn: 'What is the chemical formula of Water?',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
    optionsEn: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
    correctIndex: 1,
    categoryMr: 'विज्ञान व रसायनशास्त्र',
    categoryEn: 'Science & Chemistry',
    explanationMr: 'पाण्यात हायड्रोजनचे २ अणू आणि ऑक्सिजनचा १ अणू असतो, म्हणून सूत्र H₂O आहे.',
    explanationEn: 'Water consists of 2 hydrogen atoms and 1 oxygen atom (H₂O).',
    timeLimit: 15
  },
  {
    id: 'sci_3',
    topicId: 'science',
    questionMr: 'हिरव्या वनस्पती सूर्यप्रकाशात स्वतःचे अन्न तयार करतात, या प्रक्रियेस काय म्हणतात?',
    questionEn: 'The process by which green plants make food using sunlight is called?',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['प्रकाशसंश्लेषण (Photosynthesis)', 'श्वसन (Respiration)', 'बाष्पीभवन (Evaporation)', 'पचन (Digestion)'],
    optionsEn: ['Photosynthesis', 'Respiration', 'Evaporation', 'Digestion'],
    correctIndex: 0,
    categoryMr: 'विज्ञान व वनस्पतीशास्त्र',
    categoryEn: 'Science & Biology',
    explanationMr: 'वनस्पती हरितद्रव्य (Chlorophyll), सूर्यप्रकाश, पाणी व कार्बन डायऑक्साइड वापरून प्रकाशसंश्लेषण करतात.',
    explanationEn: 'Plants produce glucose and oxygen through the process of photosynthesis.',
    timeLimit: 20
  },
  {
    id: 'sci_4',
    topicId: 'science',
    questionMr: 'झाडावरून सफरचंद खाली पडताना पाहून "गुरुत्वाकर्षणाचा नियम" (Law of Gravity) कोणी शोधला?',
    questionEn: 'Who discovered the Law of Gravity after watching an apple fall?',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['सर आयझॅक न्यूटन', 'अल्बर्ट आईनस्टाईन', 'गॅलिलिओ गॅलिली', 'थॉमस एडिसन'],
    optionsEn: ['Sir Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Thomas Edison'],
    correctIndex: 0,
    categoryMr: 'विज्ञान व भौतिकशास्त्र',
    categoryEn: 'Science & Physics',
    explanationMr: 'सर आयझॅक न्यूटन यांनी १६८७ मध्ये वैश्विक गुरुत्वाकर्षणाचा मूलभूत नियम मांडला.',
    explanationEn: 'Sir Isaac Newton formulated the laws of gravity and motion.',
    timeLimit: 20
  },

  // --- गणित व बुद्धिमत्ता (Math & Logic) ---
  {
    id: 'math_1',
    topicId: 'math',
    questionMr: 'एका तासामध्ये एकूण किती सेकंद (Seconds) असतात?',
    questionEn: 'How many seconds are there in one hour?',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['६० सेकंद', '६०० सेकंद', '३६०० सेकंद', '६००० सेकंद'],
    optionsEn: ['60 seconds', '600 seconds', '3600 seconds', '6000 seconds'],
    correctIndex: 2,
    categoryMr: 'गणित व वेळ',
    categoryEn: 'Math & Time',
    explanationMr: '१ तास = ६० मिनिटे आणि १ मिनिट = ६० सेकंद, म्हणून ६० × ६० = ३६०० सेकंद.',
    explanationEn: '1 hour = 60 minutes × 60 seconds = 3600 seconds.',
    timeLimit: 20
  },
  {
    id: 'math_2',
    topicId: 'math',
    questionMr: '२५ × ४ याचे योग्य उत्तर किती येईल?',
    questionEn: 'What is the product of 25 × 4?',
    optionsMr: ['५०', '७५', '१००', '१२५'],
    optionsEn: ['50', '75', '100', '125'],
    correctIndex: 2,
    categoryMr: 'गणित व आकडेमोड',
    categoryEn: 'Math & Calculation',
    explanationMr: '२५ चा पाढा ४ पर्यंत मोजल्यास २५ × ४ = १०० उत्तर मिळते.',
    explanationEn: '25 multiplied by 4 equals 100.',
    timeLimit: 15
  },
  {
    id: 'math_3',
    topicId: 'math',
    questionMr: 'त्रिकोणाला (Triangle) एकूण किती बाजू आणि किती शिरोबिंदू असतात?',
    questionEn: 'How many sides and vertices does a triangle have?',
    optionsMr: ['३ बाजू व ३ शिरोबिंदू', '४ बाजू व ४ शिरोबिंदू', '२ बाजू व ३ शिरोबिंदू', '५ बाजू व ५ शिरोबिंदू'],
    optionsEn: ['3 sides & 3 vertices', '4 sides & 4 vertices', '2 sides & 3 vertices', '5 sides & 5 vertices'],
    correctIndex: 0,
    categoryMr: 'गणित व भूमिती',
    categoryEn: 'Math & Geometry',
    explanationMr: 'त्रिकोण ही तीन बाजू आणि तीन कोनांनी बनलेली बंदिस्त भूमितीय आकृती असते.',
    explanationEn: 'A triangle is a 3-sided polygon with 3 vertices and interior angles summing to 180°.',
    timeLimit: 15
  },
  {
    id: 'math_4',
    topicId: 'math',
    questionMr: 'सर्व संख्यांमध्ये सर्वात लहान "मूळ संख्या" (Smallest Prime Number) कोणती आहे?',
    questionEn: 'Which is the smallest prime number (and only even prime)?',
    optionsMr: ['०', '१', '२', '३'],
    optionsEn: ['0', '1', '2', '3'],
    correctIndex: 2,
    categoryMr: 'गणित व संख्याज्ञान',
    categoryEn: 'Math & Numbers',
    explanationMr: '२ ही सर्वात लहान आणि एकमेव सम (Even) मूळ संख्या आहे. १ ही संख्या मूळही नाही व संयुक्तही नाही.',
    explanationEn: '2 is the smallest and only even prime number.',
    timeLimit: 20
  },

  // ==========================================
  // --- गणित: अपूर्णांक (FRACTIONS - पातळी १ ते ९) ---
  // ==========================================

  // --- पातळी १ व २ (पायाभूत ओळख - Basic Concept & Identification) ---
  {
    id: 'frac_l1_1',
    topicId: 'fractions',
    questionMr: 'पातळी १ (पायाभूत ओळख): शेजारील वर्तुळाचे ४ समान भाग केले असून त्यापैकी १ भाग रंगवला आहे, तर हा रंगवलेला भाग कोणता अपूर्णांक दर्शवतो?',
    questionEn: 'Level 1 (Basics): A circle is divided into 4 equal parts and 1 part is shaded. Which fraction represents this?',
    imageUrl: createFractionCircleSvg(1, 4, '#f59e0b'),
    optionsMr: ['१/४ (पाव भाग)', '१/२ (अर्धा भाग)', '३/४ (पाऊण भाग)', '२/३'],
    optionsEn: ['1/4 (Quarter)', '1/2 (Half)', '3/4 (Three-Fourths)', '2/3'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी १ (पायाभूत ओळख)',
    categoryEn: 'Fractions: Level 1 (Basics)',
    explanationMr: 'एकूण समान भाग = ४ (हा छेद असतो) आणि रंगवलेला भाग = १ (हा अंश असतो), म्हणून हा अपूर्णांक १/४ (पाव भाग) आहे.',
    explanationEn: 'Total parts = 4 (Denominator), Shaded parts = 1 (Numerator). Fraction is 1/4 (Quarter).',
    timeLimit: 20
  },
  {
    id: 'frac_l1_2',
    topicId: 'fractions',
    questionMr: 'पातळी १ (पायाभूत ओळख): ३/७ या अपूर्णांकामध्ये "अंश" (Numerator) आणि "छेद" (Denominator) अनुक्रमे कोणते आहेत?',
    questionEn: 'Level 1 (Basics): In the fraction 3/7, what are the numerator and denominator respectively?',
    optionsMr: ['अंश = ३, छेद = ७', 'अंश = ७, छेद = ३', 'अंश = १०, छेद = ३', 'अंश = ४, छेद = ७'],
    optionsEn: ['Numerator = 3, Denominator = 7', 'Numerator = 7, Denominator = 3', 'Numerator = 10, Denominator = 3', 'Numerator = 4, Denominator = 7'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी १ (अंश व छेद)',
    categoryEn: 'Fractions: Level 1 (Numerator & Denominator)',
    explanationMr: 'रेषेच्या वरचा अंक "अंश" (Numerator = ३) असतो आणि रेषेच्या खालचा अंक "छेद" (Denominator = ७) असतो.',
    explanationEn: 'The top number is the Numerator (3) and the bottom number is the Denominator (7).',
    timeLimit: 15
  },
  {
    id: 'frac_l2_1',
    topicId: 'fractions',
    questionMr: 'पातळी २ (पायाभूत ओळख): शेजारील पट्टीचे ८ समान भाग केले असून त्यापैकी ५ भाग रंगवले आहेत, तर हा अपूर्णांक कसा लिहिला जाईल?',
    questionEn: 'Level 2 (Basics): A bar has 8 equal parts and 5 are shaded. What is the fraction?',
    imageUrl: createFractionBarSvg(5, 8, '#38bdf8'),
    optionsMr: ['५/८', '३/८', '८/५', '५/३'],
    optionsEn: ['5/8', '3/8', '8/5', '5/3'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी २ (आकृती वाचन)',
    categoryEn: 'Fractions: Level 2 (Visual Fractions)',
    explanationMr: 'एकूण समान भाग ८ आहेत (छेद) व रंगवलेले ५ आहेत (अंश), म्हणून ५/८ असे लिहिले जाते व "पाच अष्टमांश" असे वाचले जाते.',
    explanationEn: 'Total parts 8, shaded parts 5. The fraction is 5/8.',
    timeLimit: 20
  },
  {
    id: 'frac_l2_2',
    topicId: 'fractions',
    questionMr: 'पातळी २ (पायाभूत ओळख): एका सफरचंदाचे समान २ तुकडे केले आणि मित्राला १ तुकडा दिला, तर त्याला सफरचंदाचा किती भाग मिळाला?',
    questionEn: 'Level 2 (Basics): An apple is split into 2 equal parts and 1 part is given. What fraction was given?',
    imageUrl: createFractionCircleSvg(1, 2, '#ef4444'),
    optionsMr: ['१/२ (अर्धा)', '१/४ (पाव)', '३/४ (पाऊण)', '२/२ (पूर्ण)'],
    optionsEn: ['1/2 (Half)', '1/4 (Quarter)', '3/4 (Three-Fourths)', '2/2 (Whole)'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी २ (व्यवहारी ओळख)',
    categoryEn: 'Fractions: Level 2 (Real World Fractions)',
    explanationMr: 'दोन समान भागांपैकी एक भाग म्हणजे १/२ (अर्धा भाग).',
    explanationEn: 'One out of two equal parts is 1/2 (Half).',
    timeLimit: 15
  },

  // --- पातळी ३ व ४ (सममूल्य अपूर्णांक - Equivalent Fractions) ---
  {
    id: 'frac_l3_1',
    topicId: 'fractions',
    questionMr: 'पातळी ३ (सममूल्य अपूर्णांक): १/२ या अपूर्णांकाचा खालीलपैकी "सममूल्य अपूर्णांक" (Equivalent Fraction) कोणता आहे?',
    questionEn: 'Level 3 (Equivalent Fractions): Which of the following is equivalent to 1/2?',
    imageUrl: createFractionCircleSvg(2, 4, '#10b981'),
    optionsMr: ['२/४', '२/५', '३/७', '१/३'],
    optionsEn: ['2/4', '2/5', '3/7', '1/3'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ३ (सममूल्य)',
    categoryEn: 'Fractions: Level 3 (Equivalent Fractions)',
    explanationMr: 'अंश व छेदाला एकाच संख्येने (२ ने) गुणल्यास: (१ × २)/(२ × २) = २/४ मिळते. म्हणून १/२ आणि २/४ सममूल्य आहेत.',
    explanationEn: 'Multiplying numerator and denominator by 2 gives (1×2)/(2×2) = 2/4.',
    timeLimit: 20
  },
  {
    id: 'frac_l3_2',
    topicId: 'fractions',
    questionMr: 'पातळी ३ (सममूल्य अपूर्णांक): २/३ या अपूर्णांकाच्या अंशाला व छेदाला ३ ने गुणल्यास कोणता सममूल्य अपूर्णांक मिळेल?',
    questionEn: 'Level 3 (Equivalent): If numerator & denominator of 2/3 are multiplied by 3, what equivalent fraction is formed?',
    optionsMr: ['६/९', '५/६', '६/६', '२/९'],
    optionsEn: ['6/9', '5/6', '6/6', '2/9'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ३ (समान गुणक)',
    categoryEn: 'Fractions: Level 3 (Multiplication Rule)',
    explanationMr: '(२ × ३) / (३ × ३) = ६/९. म्हणून ६/९ हा २/३ चा अचूक सममूल्य अपूर्णांक आहे.',
    explanationEn: '(2 × 3) / (3 × 3) = 6/9.',
    timeLimit: 20
  },
  {
    id: 'frac_l4_1',
    topicId: 'fractions',
    questionMr: 'पातळी ४ (सममूल्य अपूर्णांक): रिकाम्या जागी कोणती संख्या येईल? ३/४ = [ ? ] / १२',
    questionEn: 'Level 4 (Equivalent): Find the missing numerator: 3/4 = [ ? ] / 12',
    optionsMr: ['९', '६', '७', '१२'],
    optionsEn: ['9', '6', '7', '12'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ४ (गाळलेली जागा)',
    categoryEn: 'Fractions: Level 4 (Missing Numerator)',
    explanationMr: 'छेद ४ वरून १२ झाला (४ × ३ = १२). म्हणून अंशालाही ३ ने गुणावे लागेल: ३ × ३ = ९. उत्तर ९ आहे.',
    explanationEn: '4 × 3 = 12. Multiply numerator by 3: 3 × 3 = 9.',
    timeLimit: 20
  },
  {
    id: 'frac_l4_2',
    topicId: 'fractions',
    questionMr: 'पातळी ४ (सममूल्य अपूर्णांक): ४/८ या अपूर्णांकाचे अतिसंक्षिप्त (Simplest / Equivalent) रूप कोणते येईल?',
    questionEn: 'Level 4 (Simplest Form): What is the simplest equivalent form of 4/8?',
    optionsMr: ['१/२', '१/४', '२/३', '३/४'],
    optionsEn: ['1/2', '1/4', '2/3', '3/4'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ४ (संक्षिप्त रूप)',
    categoryEn: 'Fractions: Level 4 (Simplest Form)',
    explanationMr: 'अंश व छेद दोन्हीला ४ ने भागल्यास (४ ÷ ४)/(८ ÷ ४) = १/२ मिळते.',
    explanationEn: 'Dividing numerator and denominator by 4 yields 1/2.',
    timeLimit: 15
  },

  // --- पातळी ५ व ६ (स्वयं-मूल्यमापन - Auto Assessment & Evaluation) ---
  {
    id: 'frac_l5_1',
    topicId: 'fractions',
    questionMr: 'पातळी ५ (स्वयं-मूल्यमापन): संगणकीय स्वयंतपासणी: २/७ + ३/७ = ? अचूक बेरीज निवडा.',
    questionEn: 'Level 5 (Auto-Evaluation): Computer automated check: 2/7 + 3/7 = ? Select correct sum.',
    optionsMr: ['५/७', '५/१४', '६/७', '१/७'],
    optionsEn: ['5/7', '5/14', '6/7', '1/7'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ५ (स्वयं-मूल्यमापन बेरीज)',
    categoryEn: 'Fractions: Level 5 (Auto Addition)',
    explanationMr: 'समछेद अपूर्णांकांची बेरीज करताना छेद तोच राहतो आणि फक्त अंशांची बेरीज होते: (२ + ३)/७ = ५/७.',
    explanationEn: 'Keep common denominator 7, add numerators: (2+3)/7 = 5/7.',
    timeLimit: 20
  },
  {
    id: 'frac_l5_2',
    topicId: 'fractions',
    questionMr: 'पातळी ५ (स्वयं-मूल्यमापन): संगणक प्रणालीनुसार: ७/९ मधून २/९ वजा केल्यास (७/९ - २/९) शिल्लक किती राहील?',
    questionEn: 'Level 5 (Auto-Evaluation): Automated check: 7/9 - 2/9 = ? What is the result?',
    optionsMr: ['५/९', '५/०', '९/९', '५/१८'],
    optionsEn: ['5/9', '5/0', '9/9', '5/18'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ५ (स्वयं-मूल्यमापन वजाबाकी)',
    categoryEn: 'Fractions: Level 5 (Auto Subtraction)',
    explanationMr: 'छेद समान (९) आहे, म्हणून अंशांची वजाबाकी: ७ - २ = ५. अचूक उत्तर = ५/९.',
    explanationEn: 'Common denominator 9. Subtract numerators: 7 - 2 = 5/9.',
    timeLimit: 20
  },
  {
    id: 'frac_l6_1',
    topicId: 'fractions',
    questionMr: 'पातळी ६ (स्वयं-मूल्यमापन): संगणकीय पडताळणी: एका वर्गात ४० विद्यार्थी आहेत, त्यापैकी १/२ विद्यार्थी मुले आहेत, तर वर्गात एकूण किती मुले आहेत?',
    questionEn: 'Level 6 (Self-Assessment): In a class of 40 students, 1/2 are boys. How many boys are there?',
    optionsMr: ['२० मुले', '१० मुले', '३० मुले', '१५ मुले'],
    optionsEn: ['20 boys', '10 boys', '30 boys', '15 boys'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ६ (स्वयं-मूल्यमापन व्यवहारी)',
    categoryEn: 'Fractions: Level 6 (Auto Problem Solving)',
    explanationMr: '४० चा १/२ भाग = ४० ÷ २ = २० मुले. संगणक प्रणालीनुसार हे अचूक उत्तर आहे.',
    explanationEn: '1/2 of 40 = 40 ÷ 2 = 20 boys.',
    timeLimit: 20
  },
  {
    id: 'frac_l6_2',
    topicId: 'fractions',
    questionMr: 'पातळी ६ (स्वयं-मूल्यमापन): संगणकीय चाचणी: खालीलपैकी कोणते विधान गणितीयदृष्ट्या "सत्य" आहे?',
    questionEn: 'Level 6 (Self-Assessment): Computer verification: Which of the following statements is mathematically TRUE?',
    optionsMr: ['२/४ = ३/६ (दोन्ही १/२ आहेत)', '१/३ = १/४', '२/५ > ४/५', '३/७ = ७/३'],
    optionsEn: ['2/4 = 3/6 (both equal 1/2)', '1/3 = 1/4', '2/5 > 4/5', '3/7 = 7/3'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ६ (सत्य विधान पडताळणी)',
    categoryEn: 'Fractions: Level 6 (Mathematical Truth)',
    explanationMr: '२/४ = १/२ आणि ३/६ = १/२. दोन्हीचे संक्षिप्त रूप अर्धा असल्याने हे विधान पूर्णपणे सत्य आहे!',
    explanationEn: 'Both simplify to 1/2, so 2/4 = 3/6 is true.',
    timeLimit: 20
  },

  // --- पातळी ७ व ८ (लहान-मोठेपणा व डिजिटल तराजू - Balance Scale Comparison) ---
  {
    id: 'frac_l7_1',
    topicId: 'fractions',
    questionMr: 'पातळी ७ (डिजिटल तराजू तुलना): तराजूच्या डाव्या तागडीत ३/५ आणि उजव्या तागडीत १/५ ठेवल्यास, कोणते तागडे खाली झुकेल?',
    questionEn: 'Level 7 (Digital Scale): If 3/5 is on the left pan and 1/5 is on the right pan, which pan tilts down?',
    imageUrl: createBalanceScaleSvg('३/५', '१/५', 'left'),
    optionsMr: ['डावे तागडे (३/५ हे १/५ पेक्षा मोठे आहे)', 'उजवे तागडे (१/५)', 'दोन्ही समतोल राहतील', 'सांगता येत नाही'],
    optionsEn: ['Left pan (3/5 is heavier than 1/5)', 'Right pan (1/5)', 'Both stay balanced', 'Cannot say'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ७ (डिजिटल तराजू)',
    categoryEn: 'Fractions: Level 7 (Digital Balance Scale)',
    explanationMr: 'समान छेद (५) असताना ज्याचा अंश मोठा (३ > १) तो अपूर्णांक मोठा व वजनदार असतो. म्हणून डावे तागडे खाली झुकेल (३/५ > १/५)!',
    explanationEn: 'With like denominators, larger numerator (3 > 1) is greater. Left pan tilts down.',
    timeLimit: 20
  },
  {
    id: 'frac_l7_2',
    topicId: 'fractions',
    questionMr: 'पातळी ७ (लहान-मोठेपणा): २/९ आणि ५/९ यांची तुलना करताना योग्य चिन्ह (<, =, >) कोणते येईल? २/९ [ ? ] ५/९',
    questionEn: 'Level 7 (Comparison): Compare 2/9 [ ? ] 5/9 using correct sign (<, =, >).',
    optionsMr: ['< (लहान)', '> (मोठा)', '= (समान)', 'यांपैकी नाही'],
    optionsEn: ['< (Less than)', '> (Greater than)', '= (Equal to)', 'None of these'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ७ (चिन्ह तुलना)',
    categoryEn: 'Fractions: Level 7 (Symbol Comparison)',
    explanationMr: 'छेद ९ समान आहे. अंश २ हा ५ पेक्षा लहान असल्याने २/९ < ५/९.',
    explanationEn: 'Since 2 < 5 with common denominator 9, 2/9 < 5/9.',
    timeLimit: 15
  },
  {
    id: 'frac_l8_1',
    topicId: 'fractions',
    questionMr: 'पातळी ८ (डिजिटल तराजू समतोल): तराजूच्या डाव्या बाजूला २/४ आणि उजव्या बाजूला ४/८ ठेवल्यास, डिजिटल तराजूवर काय दिसेल?',
    questionEn: 'Level 8 (Digital Balance): Left pan has 2/4 and right pan has 4/8. What happens to the balance scale?',
    imageUrl: createBalanceScaleSvg('२/४', '४/८', 'balanced'),
    optionsMr: ['= दोन्ही तागडी तंतोतंत समतोल राहतील (समान वजन)', 'डावे तागडे खाली झुकेल', 'उजवे तागडे खाली झुकेल', 'तराजू कलंडेल'],
    optionsEn: ['= Both pans remain perfectly balanced (Equal weight)', 'Left tilts down', 'Right tilts down', 'Scale drops'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ८ (तराजू समतोल)',
    categoryEn: 'Fractions: Level 8 (Equilibrium Balance)',
    explanationMr: '२/४ = १/२ आणि ४/८ = १/२. दोन्ही अपूर्णांक सममूल्य (समान) असल्याने डिजिटल तराजू अचूक समतोल (=) राहील!',
    explanationEn: 'Both fractions equal 1/2. Equal weights maintain perfect equilibrium (=)!',
    timeLimit: 20
  },
  {
    id: 'frac_l8_2',
    topicId: 'fractions',
    questionMr: 'पातळी ८ (डिजिटल तराजू तुलना): भिन्नछेद अपूर्णांक ३/४ आणि २/३ यांच्यात डिजिटल तराजूवर कोणते तागडे खाली झुकेल?',
    questionEn: 'Level 8 (Unlike Fractions Scale): Between 3/4 and 2/3 on the balance scale, which pan tilts down?',
    imageUrl: createBalanceScaleSvg('३/४', '२/३', 'left'),
    optionsMr: ['डावे तागडे ३/४ (कारण ३/४ = ९/१२ आणि २/३ = ८/१२)', 'उजवे तागडे २/३', 'दोन्ही समतोल', 'दोन्ही वर जातील'],
    optionsEn: ['Left pan 3/4 (since 3/4 = 9/12 > 8/12 = 2/3)', 'Right pan 2/3', 'Balanced', 'Both go up'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ८ (भिन्नछेद तुलना)',
    categoryEn: 'Fractions: Level 8 (Unlike Fractions Comparison)',
    explanationMr: 'छेद समान करू: ३/४ = ९/१२ आणि २/३ = ८/१२. ९/१२ > ८/१२ असल्याने ३/४ मोठे व जड आहे. डावे तागडे खाली झुकेल!',
    explanationEn: '3/4 = 9/12 and 2/3 = 8/12. Since 9/12 > 8/12, 3/4 is heavier and tilts the left pan down!',
    timeLimit: 20
  },

  // --- पातळी ९ (अपूर्णांकांचे प्रकार: समछेद व भिन्नछेद - Types of Fractions) ---
  {
    id: 'frac_l9_1',
    topicId: 'fractions',
    questionMr: 'पातळी ९ (अपूर्णांकांचे प्रकार): ज्या अपूर्णांकांचे "छेद समान" असतात (उदा. ३/८, ५/८, ७/८) अशा अपूर्णांकांना काय म्हणतात?',
    questionEn: 'Level 9 (Types of Fractions): Fractions having identical denominators (e.g., 3/8, 5/8, 7/8) are called?',
    optionsMr: ['समछेद अपूर्णांक (Like Fractions)', 'भिन्नछेद अपूर्णांक (Unlike Fractions)', 'पूर्णांक संख्या', 'दशांश अपूर्णांक'],
    optionsEn: ['Like Fractions', 'Unlike Fractions', 'Whole Numbers', 'Decimal Fractions'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ९ (समछेद प्रकार)',
    categoryEn: 'Fractions: Level 9 (Like Fractions)',
    explanationMr: 'ज्या अपूर्णांकांचे छेद सारखे (समान) असतात त्यांना "समछेद अपूर्णांक" (Like Fractions) म्हणतात.',
    explanationEn: 'Fractions with the same denominator are called Like Fractions.',
    timeLimit: 15
  },
  {
    id: 'frac_l9_2',
    topicId: 'fractions',
    questionMr: 'पातळी ९ (अपूर्णांकांचे प्रकार): खालीलपैकी "भिन्नछेद अपूर्णांकांची" (Unlike Fractions) जोडी कोणती आहे?',
    questionEn: 'Level 9 (Types): Which of the following is a pair of Unlike Fractions?',
    optionsMr: ['२/५ आणि ३/७ (छेद वेगवेगळे आहेत)', '३/८ आणि ५/८', '४/९ आणि ७/९', '१/६ आणि ५/६'],
    optionsEn: ['2/5 and 3/7 (Different denominators)', '3/8 and 5/8', '4/9 and 7/9', '1/6 and 5/6'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ९ (भिन्नछेद प्रकार)',
    categoryEn: 'Fractions: Level 9 (Unlike Fractions)',
    explanationMr: '२/५ चा छेद ५ आहे आणि ३/७ चा छेद ७ आहे. छेद भिन्न (वेगवेगळे) असल्याने त्यांना "भिन्नछेद अपूर्णांक" म्हणतात.',
    explanationEn: 'Denominators 5 and 7 are different, making them Unlike Fractions.',
    timeLimit: 15
  },
  {
    id: 'frac_l9_3',
    topicId: 'fractions',
    questionMr: 'पातळी ९ (अपूर्णांकांचे प्रकार): ज्या अपूर्णांकामध्ये "अंश हा छेदापेक्षा लहान" असतो (उदा. ३/५), त्यास कोणता अपूर्णांक म्हणतात?',
    questionEn: 'Level 9 (Types): A fraction where numerator is smaller than denominator (e.g. 3/5) is called?',
    optionsMr: ['छेदाधिक अपूर्णांक (Proper Fraction)', 'अंशाधिक अपूर्णांक (Improper Fraction)', 'पूर्णांकयुक्त अपूर्णांक', 'मिश्र अपूर्णांक'],
    optionsEn: ['Proper Fraction', 'Improper Fraction', 'Mixed Fraction', 'Whole Fraction'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ९ (छेदाधिक)',
    categoryEn: 'Fractions: Level 9 (Proper Fractions)',
    explanationMr: 'अंश < छेद असल्यास त्यास "छेदाधिक अपूर्णांक" (Proper Fraction) म्हणतात (याची किंमत १ पेक्षा लहान असते).',
    explanationEn: 'When numerator < denominator, it is a Proper Fraction (value less than 1).',
    timeLimit: 15
  },
  {
    id: 'frac_l9_4',
    topicId: 'fractions',
    questionMr: 'पातळी ९ (अपूर्णांकांचे प्रकार): ज्या अपूर्णांकामध्ये "अंश हा छेदापेक्षा मोठा" असतो (उदा. ७/४), त्यास काय म्हणतात?',
    questionEn: 'Level 9 (Types): A fraction where numerator is greater than denominator (e.g. 7/4) is called?',
    optionsMr: ['अंशाधिक अपूर्णांक (Improper Fraction)', 'छेदाधिक अपूर्णांक (Proper Fraction)', 'समछेद अपूर्णांक', 'दशांश अपूर्णांक'],
    optionsEn: ['Improper Fraction', 'Proper Fraction', 'Like Fraction', 'Decimal Fraction'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ९ (अंशाधिक)',
    categoryEn: 'Fractions: Level 9 (Improper Fractions)',
    explanationMr: 'अंश > छेद असल्यास त्यास "अंशाधिक अपूर्णांक" (Improper Fraction) म्हणतात (याची किंमत १ पेक्षा मोठी असते).',
    explanationEn: 'When numerator > denominator, it is an Improper Fraction (value greater than 1).',
    timeLimit: 15
  },
  {
    id: 'frac_l9_5',
    topicId: 'fractions',
    questionMr: 'पातळी ९ (अपूर्णांकांचे प्रकार): ३ पूर्णांक २/५ (३ ⅖) या प्रकारच्या अपूर्णांकास काय म्हणतात?',
    questionEn: 'Level 9 (Types): A number consisting of a whole number and a fraction (e.g. 3 2/5) is called?',
    optionsMr: ['पूर्णांकयुक्त अपूर्णांक (Mixed Fraction)', 'समछेद अपूर्णांक', 'दशांश अपूर्णांक', 'अपूर्णांक नाही'],
    optionsEn: ['Mixed Fraction', 'Like Fraction', 'Decimal Fraction', 'Not a fraction'],
    correctIndex: 0,
    categoryMr: 'अपूर्णांक: पातळी ९ (पूर्णांकयुक्त)',
    categoryEn: 'Fractions: Level 9 (Mixed Fractions)',
    explanationMr: 'पूर्णांक आणि अपूर्णांक एकत्र मिळून बनणाऱ्या संख्येला "पूर्णांकयुक्त अपूर्णांक" (Mixed Fraction) म्हणतात.',
    explanationEn: 'A whole number combined with a fraction is called a Mixed Fraction.',
    timeLimit: 15
  },
  {
    id: 'wild_1',
    topicId: 'wildlife',
    questionMr: 'खालीलपैकी भारताचा राष्ट्रीय पक्षी (National Bird) कोणता?',
    questionEn: 'Which of the following is the National Bird of India?',
    optionsMr: ['मोर (Peacock)', 'पोपट (Parrot)', 'गरुड (Eagle)', 'कबूतर (Pigeon)'],
    optionsEn: ['Peacock', 'Parrot', 'Eagle', 'Pigeon'],
    optionImages: [
      'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=500&q=80'
    ],
    correctIndex: 0,
    categoryMr: 'पर्यावरण व पक्षी',
    categoryEn: 'Nature & Birds',
    explanationMr: 'मोर (Peacock) हा भारताचा राष्ट्रीय पक्षी असून त्याच्या पंखांचे सौंदर्य आणि नृत्य प्रसिद्ध आहे.',
    explanationEn: 'Peacock is the National Bird of India, known for its majestic plumage.',
    timeLimit: 20
  },
  {
    id: 'wild_2',
    topicId: 'wildlife',
    questionMr: 'खालीलपैकी भारताचा राष्ट्रीय प्राणी (National Animal) कोणता?',
    questionEn: 'Which of the following is the National Animal of India?',
    optionsMr: ['वाघ (Bengal Tiger)', 'सिंह (Asiatic Lion)', 'हत्ती (Elephant)', 'बिबट्या (Leopard)'],
    optionsEn: ['Bengal Tiger', 'Asiatic Lion', 'Elephant', 'Leopard'],
    optionImages: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=500&q=80'
    ],
    correctIndex: 0,
    categoryMr: 'पर्यावरण व प्राणी',
    categoryEn: 'Wildlife & Animals',
    explanationMr: 'रॉयल बंगाल टायगर (वाघ) हा भारताचा राष्ट्रीय प्राणी असून तो ताकद आणि चपळाईचे प्रतीक आहे.',
    explanationEn: 'The Royal Bengal Tiger is the National Animal of India, symbolizing strength and agility.',
    timeLimit: 20
  },
  {
    id: 'wild_3',
    topicId: 'wildlife',
    questionMr: 'महाराष्ट्राचा राज्य प्राणी (State Animal of Maharashtra) कोणता आहे?',
    questionEn: 'Which is the State Animal of Maharashtra?',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['शेकरू (मोठी खार)', 'वाघ', 'चित्ता', 'सांबर'],
    optionsEn: ['Shekru (Giant Squirrel)', 'Tiger', 'Leopard', 'Sambar Deer'],
    correctIndex: 0,
    categoryMr: 'पर्यावरण व प्राणी',
    categoryEn: 'Wildlife & Nature',
    explanationMr: 'शेकरू (Indian Giant Squirrel) ही भीमाशंकरच्या जंगलात आढळणारी मोठी खार असून तो महाराष्ट्राचा राज्य प्राणी आहे.',
    explanationEn: 'Shekru (Giant Squirrel found in Bhimashankar) is the State Animal of Maharashtra.',
    timeLimit: 20
  },
  {
    id: 'wild_4',
    topicId: 'wildlife',
    questionMr: 'जागतिक पर्यावरण दिन (World Environment Day) दरवर्षी कोणत्या तारखेला साजरा केला जातो?',
    questionEn: 'On which date is World Environment Day celebrated globally every year?',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['५ जून', '२२ एप्रिल', '१ मे', '१५ ऑगस्ट'],
    optionsEn: ['5th June', '22nd April', '1st May', '15th August'],
    correctIndex: 0,
    categoryMr: 'पर्यावरण व दिनविशेष',
    categoryEn: 'Environment & Dates',
    explanationMr: '५ जून हा दिवस जगभरात पर्यावरणाचे रक्षण आणि संवर्धनासाठी जागतिक पर्यावरण दिन म्हणून पाळला जातो.',
    explanationEn: 'World Environment Day is celebrated annually on June 5th.',
    timeLimit: 15
  },

  // --- सामान्य ज्ञान (General Knowledge) ---
  {
    id: 'gk_1',
    topicId: 'gk',
    questionMr: 'भारताचे राष्ट्रीय फूल (National Flower) कोणते आहे?',
    questionEn: 'Which is the National Flower of India?',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['गुलाब (Rose)', 'कमळ (Lotus)', 'जास्वंद (Hibiscus)', 'सूर्यफूल (Sunflower)'],
    optionsEn: ['Rose', 'Lotus', 'Hibiscus', 'Sunflower'],
    correctIndex: 1,
    categoryMr: 'सामान्य ज्ञान व प्रतीके',
    categoryEn: 'General Knowledge & Symbols',
    explanationMr: 'कमळ (Lotus) हे भारताचे राष्ट्रीय फूल असून ते पावित्र्य आणि सौंदर्याचे प्रतीक मानले जाते.',
    explanationEn: 'Lotus is the National Flower of India.',
    timeLimit: 15
  },
  {
    id: 'gk_2',
    topicId: 'gk',
    questionMr: 'खालीलपैकी कोणते फळ "फळांचा राजा" (King of Fruits) मानले जाते?',
    questionEn: 'Which fruit is celebrated as the "King of Fruits"?',
    optionsMr: ['सफरचंद (Apple)', 'आंबा (Mango)', 'केळी (Banana)', 'संत्रा (Orange)'],
    optionsEn: ['Apple', 'Mango', 'Banana', 'Orange'],
    optionImages: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=500&q=80'
    ],
    correctIndex: 1,
    categoryMr: 'सामान्य ज्ञान व फळे',
    categoryEn: 'General Knowledge',
    explanationMr: 'आंबा (विशेषतः महाराष्ट्राचा हापूस आंबा) हा चवीने गोड आणि लोकप्रिय असल्याने फळांचा राजा म्हणून ओळखला जातो.',
    explanationEn: 'Mango (especially Alphonso of Maharashtra) is renowned worldwide as the King of Fruits.',
    timeLimit: 15
  },
  {
    id: 'gk_3',
    topicId: 'gk',
    questionMr: 'भारताच्या राष्ट्रध्वज "तिरंगा" मध्ये सर्वात वरचा रंग कोणता असतो?',
    questionEn: 'Which is the top color in India’s National Tricolor Flag?',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['केशरी (Saffron)', 'पांढरा (White)', 'हिरवा (Green)', 'निळा (Navy Blue)'],
    optionsEn: ['Saffron', 'White', 'Green', 'Navy Blue'],
    correctIndex: 0,
    categoryMr: 'सामान्य ज्ञान व राष्ट्रध्वज',
    categoryEn: 'General Knowledge & Flag',
    explanationMr: 'तिरंग्यात सर्वात वर शौर्य व त्यागाचे प्रतीक असलेला केशरी रंग असतो, मध्ये पांढरा आणि खाली समृद्धीचा हिरवा रंग असतो.',
    explanationEn: 'Saffron is at the top, white in the middle with the Ashoka Chakra, and green at the bottom.',
    timeLimit: 15
  },
  {
    id: 'gk_4',
    topicId: 'gk',
    questionMr: 'भारताचे राष्ट्रगीत "जन-गण-मन" कोणी रचले आहे?',
    questionEn: 'Who composed the National Anthem of India "Jana Gana Mana"?',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['रवींद्रनाथ टागोर', 'बंकीमचंद्र चटर्जी', 'महात्मा फुले', 'डॉ. बाबासाहेब आंबेडकर'],
    optionsEn: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Mahatma Phule', 'Dr. B.R. Ambedkar'],
    correctIndex: 0,
    categoryMr: 'सामान्य ज्ञान व साहित्य',
    categoryEn: 'General Knowledge & Literature',
    explanationMr: 'नोबेल पारितोषिक विजेते गुरुदेव रवींद्रनाथ टागोर यांनी भारताचे राष्ट्रगीत रचले आहे.',
    explanationEn: 'Nobel Laureate Rabindranath Tagore composed the national anthem.',
    timeLimit: 15
  },

  // --- संगणक व तंत्रज्ञान (Tech & Computers) ---
  {
    id: 'tech_1',
    topicId: 'technology',
    questionMr: 'संगणकाचा मेंदू (Brain of Computer) कोणाला म्हणतात?',
    questionEn: 'Which component is known as the Brain of the Computer?',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['RAM', 'CPU', 'Hard Disk', 'Monitor'],
    optionsEn: ['RAM', 'CPU', 'Hard Disk', 'Monitor'],
    correctIndex: 1,
    categoryMr: 'संगणक व तंत्रज्ञान',
    categoryEn: 'Tech & Computers',
    explanationMr: 'CPU (Central Processing Unit) सर्व संगणकीय आकडेमोड व प्रक्रिया नियंत्रित करतो.',
    explanationEn: 'CPU processes and controls all operations of the computer.',
    timeLimit: 15
  },
  {
    id: 'tech_2',
    topicId: 'technology',
    questionMr: 'इंटरनेट वेबसाईटच्या पत्त्यातील WWW चा पूर्ण विस्तार (Full Form) काय आहे?',
    questionEn: 'What does WWW stand for in website addresses?',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    optionsMr: ['World Wide Web', 'World Web Wireless', 'Wide World Web', 'World Wide Word'],
    optionsEn: ['World Wide Web', 'World Web Wireless', 'Wide World Web', 'World Wide Word'],
    correctIndex: 0,
    categoryMr: 'संगणक व इंटरनेट',
    categoryEn: 'Computers & Internet',
    explanationMr: 'WWW म्हणजे World Wide Web, ज्याचा शोध टिम बर्नर्स-ली यांनी लावला.',
    explanationEn: 'WWW stands for World Wide Web, invented by Tim Berners-Lee.',
    timeLimit: 15
  },
  {
    id: 'tech_3',
    topicId: 'technology',
    questionMr: 'संगणकामध्ये चालू फाईल सेव्ह (Save) करण्यासाठी कोणती कीबोर्ड शॉर्टकट की वापरली जाते?',
    questionEn: 'Which keyboard shortcut is used to Save a file in computers?',
    optionsMr: ['Ctrl + C', 'Ctrl + S', 'Ctrl + V', 'Ctrl + Z'],
    optionsEn: ['Ctrl + C', 'Ctrl + S', 'Ctrl + V', 'Ctrl + Z'],
    correctIndex: 1,
    categoryMr: 'संगणक व शॉर्टकट',
    categoryEn: 'Computers & Shortcuts',
    explanationMr: 'Ctrl + S ही शॉर्टकट की फाईल त्वरित सेव्ह करण्यासाठी वापरली जाते (Ctrl + C कॉपी, Ctrl + V पेस्ट).',
    explanationEn: 'Ctrl + S is the universal keyboard shortcut to save changes.',
    timeLimit: 15
  }
];

export function getTopicById(topicId: string): QuizTopic | undefined {
  return QUIZ_TOPICS.find((t) => t.id === topicId);
}

export function filterQuestionsByTopic(questions: QuizQuestion[], topicId: string): QuizQuestion[] {
  if (!topicId || topicId === 'all') return questions;
  return questions.filter((q) => {
    if (q.topicId === topicId) return true;
    const cat = `${q.categoryMr} ${q.categoryEn} ${q.questionMr}`.toLowerCase();
    if (topicId === 'fractions' && (cat.includes('अपूर्णांक') || cat.includes('fraction') || cat.includes('अंश') || cat.includes('छेद') || cat.includes('सममूल्य') || cat.includes('तराजू') || cat.includes('लहान-मोठेपणा'))) return true;
    if (topicId === 'math' && (cat.includes('गणित') || cat.includes('math') || cat.includes('संख्या') || cat.includes('वेळ') || cat.includes('अपूर्णांक') || cat.includes('fraction'))) return true;
    if (topicId === 'history' && (cat.includes('इतिहास') || cat.includes('history') || cat.includes('किल्ले'))) return true;
    if (topicId === 'geography' && (cat.includes('भूगोल') || cat.includes('geography') || cat.includes('नद्या'))) return true;
    if (topicId === 'science' && (cat.includes('विज्ञान') || cat.includes('science') || cat.includes('रसायन') || cat.includes('भौतिक'))) return true;
    if (topicId === 'math' && (cat.includes('गणित') || cat.includes('math') || cat.includes('संख्या') || cat.includes('वेळ'))) return true;
    if (topicId === 'wildlife' && (cat.includes('पर्यावरण') || cat.includes('पक्षी') || cat.includes('प्राणी') || cat.includes('wildlife') || cat.includes('nature'))) return true;
    if (topicId === 'gk' && (cat.includes('सामान्य') || cat.includes('gk') || cat.includes('general'))) return true;
    if (topicId === 'technology' && (cat.includes('तंत्रज्ञान') || cat.includes('संगणक') || cat.includes('tech') || cat.includes('computer'))) return true;
    return false;
  });
}

export const QUESTION_IMAGE_PRESETS = [
  { label: 'किल्ला / शिवनेरी (Fort)', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80' },
  { label: 'गुरु ग्रह / अंतराळ (Jupiter)', url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80' },
  { label: 'पर्वत / कळसुबाई (Mountain)', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
  { label: 'पाणी / विज्ञान (Water Drops)', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80' },
  { label: 'घड्याळ / वेळ (Clock)', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
  { label: 'कमळ फूल (Lotus)', url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80' },
  { label: 'CPU / संगणक (Computer Chip)', url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80' },
  { label: 'वाघ / प्राणी (Tiger)', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80' },
  { label: 'तिरंगा / राष्ट्रध्वज (Flag)', url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80' },
  { label: 'पुस्तक / इतिहास (Books)', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80' },
  { label: 'सूर्य / प्रकाश (Sun)', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80' },
  { label: 'लेणी / शिल्पकला (Caves)', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80' },
  { label: 'आंबा (Mango)', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80' },
  { label: 'मोर (Peacock)', url: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?auto=format&fit=crop&w=800&q=80' }
];

export const OPTION_IMAGE_PRESETS = [
  { label: 'वाघ (Tiger)', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=500&q=80' },
  { label: 'सिंह (Lion)', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=500&q=80' },
  { label: 'हत्ती (Elephant)', url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=500&q=80' },
  { label: 'बिबट्या (Leopard)', url: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=500&q=80' },
  { label: 'मोर (Peacock)', url: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?auto=format&fit=crop&w=500&q=80' },
  { label: 'पोपट (Parrot)', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80' },
  { label: 'गरुड (Eagle)', url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=500&q=80' },
  { label: 'कबूतर (Pigeon)', url: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=500&q=80' },
  { label: 'आंबा (Mango)', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=500&q=80' },
  { label: 'सफरचंद (Apple)', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80' },
  { label: 'केळी (Banana)', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80' },
  { label: 'संत्रा (Orange)', url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=500&q=80' },
  { label: 'कमळ (Lotus)', url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=500&q=80' },
  { label: 'गुलाब (Rose)', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80' },
  { label: 'सूर्यफूल (Sunflower)', url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=500&q=80' },
  { label: 'किल्ला (Fort)', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=500&q=80' }
];

export const AVATAR_OPTIONS = [
  { emoji: '🦁', name: 'सिंह (Lion)' },
  { emoji: '🐯', name: 'वाघ (Tiger)' },
  { emoji: '🚀', name: 'रॉकेट (Rocket)' },
  { emoji: '⚡', name: 'विद्युत (Bolt)' },
  { emoji: '🦉', name: 'घुबड (Wise Owl)' },
  { emoji: '🌟', name: 'तारे (Star)' },
  { emoji: '🎯', name: 'नेम (Target)' },
  { emoji: '🐬', name: 'डॉल्फिन (Dolphin)' },
  { emoji: '🦊', name: 'कोल्हा (Fox)' },
  { emoji: '👑', name: 'मुकुट (Crown)' },
  { emoji: '🦄', name: 'युनिकॉर्न (Unicorn)' },
  { emoji: '🔥', name: 'ज्वाला (Flame)' }
];

export const ANSWER_COLORS = [
  {
    bg: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700',
    border: 'border-rose-400',
    ring: 'focus:ring-rose-400',
    text: 'text-rose-100',
    shape: '▲', // Triangle
    shapeNameMr: 'त्रिकोण',
    badge: 'bg-rose-700 text-white',
    lightBg: 'bg-rose-950/40',
    key: 'A'
  },
  {
    bg: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700',
    border: 'border-blue-400',
    ring: 'focus:ring-blue-400',
    text: 'text-blue-100',
    shape: '◆', // Diamond
    shapeNameMr: 'चौकोन',
    badge: 'bg-blue-700 text-white',
    lightBg: 'bg-blue-950/40',
    key: 'B'
  },
  {
    bg: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600',
    border: 'border-amber-300',
    ring: 'focus:ring-amber-300',
    text: 'text-amber-950',
    shape: '●', // Circle
    shapeNameMr: 'वर्तुळ',
    badge: 'bg-amber-600 text-white',
    lightBg: 'bg-amber-950/40',
    key: 'C'
  },
  {
    bg: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700',
    border: 'border-emerald-400',
    ring: 'focus:ring-emerald-400',
    text: 'text-emerald-100',
    shape: '■', // Square
    shapeNameMr: 'चौरस',
    badge: 'bg-emerald-700 text-white',
    lightBg: 'bg-emerald-950/40',
    key: 'D'
  }
];
