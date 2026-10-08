const API = 'https://hacker-news.firebaseio.com/v0';
const LIMIT = 20;
const storiesEl = document.querySelector('#stories');
const errorEl = document.querySelector('#error');
const updatedEl = document.querySelector('#updated');
const countEl = document.querySelector('#story-count');
const refreshButton = document.querySelector('#refresh');

document.querySelector('#today').textContent = new Intl.DateTimeFormat('my-MM', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}).format(new Date());

// Source-checked editorial notes keyed to Hacker News item IDs. Live ranks and scores are always fetched separately.
const deepDives = {
  '50002008': {
    summary: 'Terence Tao က သင်္ချာ၏ “Math 1.0” ပုံစံ—ဖွင့်လှစ်ထားသော ပုစ္ဆာကို အရင်ဆုံးဖြေရှင်းနိုင်ခြင်းကို အဓိကထားသည့် ယှဉ်ပြိုင်မှု—ကို AI ခေတ်တွင် ပြန်စဉ်းစားရန် အဆိုပြုထားသည်။ ပြဿနာဖြေရှင်းနှုန်းကိုသာ အမြင့်ဆုံးတင်ခြင်းထက် သင်္ချာတိုးတက်မှုကို ပိုကျယ်ပြန့်စွာ တန်ဖိုးထားသည့် “Math 2.0” လိုအပ်လာကြောင်း သူ၏ပို့စ်က ဆိုသည်။',
    context: 'Tao ၏ မူရင်းပို့စ်တွင် ရှင်းလင်းတင်ပြမှု (exposition)၊ သင်္ချာအသိုင်းအဝိုင်း တည်ဆောက်မှုနှင့် သုတေသနဦးတည်ချက်အသစ် ဖွင့်ပေးခြင်းတို့ကို အောင်မြင်မှုအဖြစ် ပိုမြင်သာစေရန် တိုက်တွန်းထားသည်။ AI Agent ကို open problem တစ်ခု ပစ်ပေးပြီး အဖြေတောင်းခြင်းထက် ပိုမိုစိတ်ကူးကြီးပြီး ရည်မှန်းချက်ကျယ်ဝန်းသော အသုံးချပုံလိုအပ်သည်ဟုလည်း ရေးသားသည်။',
    bullets: ['AI က အဖြေရှာခြင်းသာမက ရှင်းလင်းဖော်ပြခြင်းနှင့် သုတေသနလမ်းကြောင်းဖွင့်ခြင်းတွင်လည်း အထောက်အကူပြုနိုင်သည်။', 'ပညာရေး၊ ထုတ်ဝေမှုနှင့် အလုပ်အကိုင်တိုးတက်မှုအတွက် သတ်မှတ်ချက်များကို AI ခေတ်နှင့်ကိုက်ညီအောင် ပြန်သုံးသပ်ရန် Tao က တိုက်တွန်းသည်။'],
    sourceNote: 'Tao ၏ မူရင်း Mastodon ပို့စ် (အပိုင်း ၄/၄) ကို တိုက်ရိုက်ဖတ်ရှုထားသည်။',
    source: 'https://mathstodon.xyz/@tao/117395269325940185'
  },
  '49996437': {
    summary: 'Anthropic ၏ Claude Haiku 5.5 သည် မြန်နှုန်းမြင့်၊ ကုန်ကျစရိတ်သက်သာပြီး အကြိမ်များစွာ ထပ်ခါတလဲလဲ လုပ်ရသော လုပ်ငန်းများအတွက် ရည်ရွယ်သည့် small Model ဖြစ်သည်။ ကုမ္ပဏီက ယခင် Haiku 4.5 ထက် ပျမ်းမျှအသုံးစရိတ် ၇၅% ခန့်လျော့ပြီး၊ ၎င်းတို့ထုတ်ဖူးသမျှ Haiku များထဲတွင် အမြန်ဆုံးဟု ဖော်ပြထားသည်။',
    context: 'Anthropic ၏ launch post အရ summary၊ context compaction၊ database query၊ classification၊ live customer support နှင့် browser use တို့သည် ရည်ရွယ်ထားသော workload များဖြစ်သည်။ Model ကို adjustable effort setting ဖြင့် cost နှင့် intelligence အကြား ချိန်ညှိနိုင်သည်။ Anthropic benchmark များတွင် OSWorld 2.1 (offline subset) 72.4%၊ Terminal-Bench 4.0 39.2% ဟု ဖော်ပြသော်လည်း benchmark ရလဒ်များသည် ကုမ္ပဏီ၏ ကိုယ်ပိုင် evaluation ဖြစ်ကြောင်း သတိပြုရမည်။',
    bullets: ['Prompt 100k token အထိ input သည် 1M tokens လျှင် $0.10၊ output $0.50 ဟើយ 100k-аас дээш үнэ тусдаа өндөр байна။', 'Anthropic က Sonnet 5.5 cache-read ဈေးနှုန်းကိုလည်း တစ်ဝက်လျှော့၍ agentic workload အများစုတွင် ၂၀% ခန့်သက်သာမည်ဟု ဆိုသည်။', 'Haiku သည် scope ကျဉ်းပြီး အများအပြား run သည့်အလုပ်အတွက် သင့်တော်ပြီး၊ အလွန်ရှုပ်ထွေးသော coding အလုပ်များတွင် ပိုကြီးသည့် Model များက ပိုကောင်းနိုင်သည်ဟု ထုတ်ပြန်ချက်က မှတ်သားထားသည်။'],
    sourceNote: 'အချက်အလက်နှင့် benchmark များသည် Anthropic ၏ 2026-10-07 ထုတ်ပြန်ချက်မှ ဖြစ်ပြီး လွတ်လပ်သည့် benchmark အတည်ပြုချက်ဟု မယူဆသင့်ပါ။',
    source: 'https://www.anthropic.com/claude-haiku-5-5'
  },
  '49970767': {
    summary: 'Hundred Rabbits သည် off-grid နေထိုင်မှုနှင့် သေးငယ်၊ လွတ်လပ်စွာအသုံးပြုနိုင်သော digital tools များအကြောင်း ဆက်လက်မျှဝေနေသည့် အနုပညာရှင်/ဖန်တီးသူအဖွဲ့၏ website ဖြစ်သည်။ ၎င်းတို့၏ home log တွင် 2026 ခုနှစ်အတွင်း software၊ ဂိမ်း၊ စာရေးသားမှုနှင့် လက်တွေ့အသုံးချ project များကို မှတ်တမ်းတင်ထားသည်။',
    context: 'လက်ရှိစာမျက်နှာတွင် privacy ကိုလေးစားသော ဆက်သွယ်ရေး၊ One-time Pad ဖြင့် စာဝှက်ခြင်းနှင့် Donsol ဂိမ်းကို browser သို့မဟုတ် Uxn emulator တွင် ထုတ်ဝေခြင်းကဲ့သို့သော လုပ်ဆောင်ချက်များ ပါဝင်သည်။ အဓိကစိတ်ဝင်စားစရာမှာ အင်တာနက်/ပလက်ဖောင်းအပေါ် အလွန်မှီခိုခြင်းမရှိဘဲ tools နှင့် knowledge ကို ထိန်းသိမ်းဖန်တီးနိုင်ပုံ ဖြစ်သည်။',
    bullets: ['တစ်ကြိမ်သုံးသော စာဝှက်ကီး (One-time Pad) အကြောင်း လက်တွေ့လေ့လာနိုင်သည့် စာမျက်နှာအသစ်ကို မှတ်တမ်းတင်ထားသည်။', 'Donsol ကို browser ထဲတွင် တိုက်ရိုက်ကစားနိုင်သည့် release အဖြစ် ပြန်ထုတ်ထားသည်။'],
    sourceNote: 'ဤအကျဉ်းချုပ်သည် HN တွင်ချိတ်ထားသည့် Hundred Rabbits home page နှင့် 2026 home log ကို အခြေခံထားသည်။',
    source: 'https://100r.ca/site/home.html'
  },
  '50001580': {
    summary: 'zerobrew သည် Homebrew package manager အတွက် macOS နှင့် Linux ပေါ်က အခြားရွေးချယ်စရာဖြစ်ပြီး “uv-style architecture” ကို အသုံးပြုသည်။ Repository ရှိ install၊ bundle၊ upgrade နှင့် garbage-collection command များက Homebrew workflow ကို အစားထိုးအသုံးပြုနိုင်ရန် ရည်ရွယ်ကြောင်း ပြသသည်။',
    context: 'Repository ၏ benchmark သည် 2026-10-08 ရက်၊ zerobrew 0.3.5 development build၊ Homebrew 7.0.8၊ M3 Pro Mac နှင့် 318 Mbit/s connection ဖြင့် စမ်းသပ်ထားသည်။ Package 100 ခုတွင် cold install အားလုံးပေါင်း 776s နှင့် 117s၊ warm install 638s နှင့် 9.3s ဟု ဖော်ပြပြီး—cold 6.6x၊ warm 68x ခန့်ကွာသည်။ “100x faster” အမှတ်အသားသည် warm run များထဲမှ 24 ခုက 100x ကျော်မြန်ခဲ့ခြင်းကို ရည်ညွှန်းသည်။',
    bullets: ['Cache ရှိပြီးသားအခါ download စောင့်ချိန်လျော့သဖြင့် အမြန်နှုန်းကွာဟမှု ပိုကြီးသည်။', 'Cold install အချိန်သည် download bandwidth အပေါ် များစွာမူတည်နိုင်သည်။', 'ဤကိန်းဂဏန်းများသည် repository maintainer ၏ ကိုယ်ပိုင်စမ်းသပ်မှုဖြစ်ပြီး အခြားစက်/ကွန်ရက်တွင် တူညီမည်ဟု အာမမခံပါ။'],
    sourceNote: 'Benchmark method နှင့် စက်/ကွန်ရက်အသေးစိတ်ကို zerobrew repository README မှ တိုက်ရိုက်ယူထားသည်။',
    source: 'https://github.com/zerobrewhq/zerobrew'
  },
  '49998895': {
    summary: 'MIT ၏ အောက်မေ့ဖွယ်ဆောင်းပါးအရ Margaret Hamilton သည် အသက် ၉၀ တွင် ကွယ်လွန်ခဲ့ပြီး Apollo အာကာသယာဉ်၏ onboard flight software ရေးသားရေးကို ဦးဆောင်ခဲ့သူဖြစ်သည်။ သူမသည် software engineering ကို သီးခြားပညာရပ်အဖြစ် အသိအမှတ်ပြုလာစေရန် အရေးပါသော အခန်းကဏ္ဍမှ ပါဝင်ခဲ့သည်။',
    context: 'Apollo အတွက် Hamilton ဦးဆောင်သည့် အဖွဲ့တွင် လူ ၄၀၀ ကျော် ပါဝင်ခဲ့သည်။ သူမ၏ defensive programming စိတ်ကူးသည် အမှားဖြစ်နိုင်ခြေကို ကြိုတင်တွက်ဆ၍ software ဖြင့် ကာကွယ်ခြင်းဖြစ်သည်။ Apollo 8 တွင် လေယာဉ်မှူးမှားယွင်း၍ P01 ကို စတင်မိပြီး navigation data ပျောက်ဆုံးခဲ့သည့် ဖြစ်ရပ်နောက်ပိုင်း အကြံပြုထားသည့် ကာကွယ်ရေးပြင်ဆင်ချက်ကို ထည့်သွင်းခဲ့သည်။ Apollo 11 ၏ 1202 alarm အချိန်တွင် priority-driven software က မလိုအပ်သော task များကို ပယ်ချကာ landing အတွက် အရေးကြီးသည့်အလုပ်များကို ဆက်လုပ်စေခဲ့သည်။',
    bullets: ['သူမ၏ အလုပ်သည် flight software သာမက software reliability၊ fault tolerance နှင့် systems engineering တို့အတွက်ပါ သက်ရောက်မှုရှိသည်။', 'Apollo နောက်ပိုင်း Higher Order Software နှင့် Hamilton Technologies ကို တည်ထောင်ကာ error-prevention နည်းလမ်းများကို ဆက်လက်ဖွံ့ဖြိုးစေခဲ့သည်။'],
    sourceNote: 'MIT News ၏ 2026-10-07 အတ္ထုပ္ပတ္တိ/အောက်မေ့ဖွယ်ဆောင်းပါးကို အခြေခံထားသည်။',
    source: 'https://news.mit.edu/2026/margaret-hamilton-computing-pioneer-dies-1007'
  },
  '49969073': {
    summary: 'ဤဆောင်းပါး၏ ခေါင်းစဉ်က Rosalind Franklin နှင့် DNA double helix ၏ ထင်ရှားသော ဓာတ်ပုံအကြောင်း သမိုင်းဆိုင်ရာ အယူအဆတစ်ခုကို ပြန်လည်စစ်ဆေးထားကြောင်း ဖော်ပြသည်။',
    context: 'မူရင်း Science စာမျက်နှာကို ဤအကြိမ်ဖတ်ရှုရန် တားမြစ်ထားသဖြင့် ဆောင်းပါး၏ အငြင်းအခုံ၊ သက်သေများနှင့် သမိုင်းဆိုင်ရာ အသေးစိတ်ကို လွတ်လပ်စွာ အတည်မပြုနိုင်ပါ။ ခေါင်းစဉ်ထက်ကျော်လွန်သော အချက်အလက်များကို ခန့်မှန်းမထည့်ထားပါ။',
    bullets: ['ဤကတ်၏ ရှင်းလင်းချက်သည် ခေါင်းစဉ်အပေါ်သာ အခြေခံထားသည်။', 'အပြည့်အစုံအတွက် မူရင်း Science ဆောင်းပါးကို ဖတ်ရှုပါ။'],
    sourceNote: 'မူရင်းစာမျက်နှာကို အလိုအလျောက်ဖတ်ရှုရာတွင် ကန့်သတ်ချက်ရှိခဲ့သည်။',
    source: 'https://www.science.org/content/article/how-did-rosalind-franklin-miss-helix-her-iconic-dna-image-she-didn-t'
  },
  '49998066': {
    summary: '404 Media ၏ ဆောင်းပါးအရ Jonathan သည် အသက် ၁၉၄ နှစ်ခန့်ရှိသော Aldabra giant tortoise ဖြစ်ပြီး ကမ္ဘာ့အသက်အရှည်ဆုံး ကုန်းနေတိရစ္ဆာန်အဖြစ် ဖော်ပြခံရသည်။ သုတေသီများက ၎င်း၏ genome ကို ပထမဆုံးအကြိမ် sequencing လုပ်ပြီး အသက်ရှည်မှုနှင့် ဆက်စပ်နိုင်သည့် မျိုးဗီဇလမ်းကြောင်းများကို စစ်ဆေးခဲ့သည်။',
    context: 'ဆောင်းပါးက Science Advances တွင် ထုတ်ဝေသော လေ့လာမှုကို ကိုးကားပြီး Jonathan ၏ genome ကို အခြားလိပ်များနှင့် နှိုင်းယှဉ်ထားကြောင်း ဖော်ပြသည်။ DNA repair၊ insulin regulation၊ mitochondrial function နှင့် methylation တို့အပါအဝင် aging pathway အများအပြားတွင် ကွဲပြားသော gene variant များတွေ့ရှိခဲ့သည်။ ဤသည် ဆက်စပ်မှုဆိုင်ရာ သုတေသနဖြစ်ပြီး လူသားတွင် အသက်ရှည်စေမည့် ကုသမှုကို သက်သေပြပြီးဖြစ်သည်ဟု မဆိုလိုပါ။',
    bullets: ['Jonathan ကို 1832 ခန့်တွင် Seychelles တွယ် аралတွင် ပေါက်ဖွားခဲ့သည်ဟု မှတ်တမ်းများက ခန့်မှန်းထားသည်။', 'အလွန်အသက်ရှည်သော တိရစ္ဆာန်များ၏ genome ကို လေ့လာခြင်းက aging biology အကြောင်း သဲလွန်စပေးနိုင်သော်လည်း လူသားအပေါ် တိုက်ရိုက်အသုံးချရန် သုတေသနအဆင့်များစွာ လိုသေးသည်။'],
    sourceNote: '404 Media ဆောင်းပါး၏ စာသားကို တိုက်ရိုက်ဖတ်ရှုထားသည်။',
    source: 'https://www.404media.co/oldest-living-land-animal-jonathan-the-tortoise/'
  },
  '49959280': {
    summary: 'စာရေးသူသည် 2011 ခုနှစ်က ကြားဖူးခဲ့သော “Salvage” အမည်ရှိ band ၏ “Electric” နှင့် “Searchlights” သီချင်းများ ဘယ်ကလာသည်ကို ၁၅ နှစ်ကြာ လိုက်ရှာခဲ့သည့် ဖြစ်စဉ်ကို မှတ်တမ်းတင်ထားသည်။ Band အမည်နှင့် သီချင်းခေါင်းစဉ်များသည် ယေဘုယျဆန်ပြီး အွန်လိုင်းရှာဖွေမှုအတွက် မလွယ်ကူခဲ့သည်။',
    context: 'ရှာဖွေမှုတွင် Discogs မှတ်တမ်း၊ Official Charts၊ GS1 barcode lookup နှင့် ကုမ္ပဏီမှတ်တမ်းများကို ဆက်စပ်အသုံးပြုခဲ့သည်။ စာရေးသူက AI Model များကို ရှာဖွေရေးအဖော်အဖြစ် အသုံးချခဲ့ပြီး၊ တစ်ခါတည်းမေးမြန်းခြင်းထက် အထောက်အထားအားလုံးပါသော dataset နှင့် ဆက်လက်မှတ်တမ်းတင်ထားသည့် အဆင့်ဆင့်စုံစမ်းမှုကို ပေးခဲ့သည်။',
    bullets: ['သီချင်းသည် 2006 ခုနှစ် ဇွန် 4–10 ရက် Independent Singles Chart တွင် နံပါတ် 47 ရောက်ခဲ့ကြောင်း Official Charts entry ကို တွေ့ရှိခဲ့သည်။', 'AI သည် မပျောက်သွားသော archive များကို ကိုယ်တိုင်အစားထိုးမပေးနိုင်ဘဲ ရှာဖွေရေးအယူအဆများ ထုတ်ပေးရန်နှင့် အချက်အလက်များကို ဆက်စပ်စဉ်းစားရန် ကူညီခဲ့သည်။'],
    sourceNote: 'စာရေးသူ၏ 2026-09-29 ရက်ပါ စုံစမ်းမှုမှတ်တမ်းကို ဖတ်ရှုထားသည်။',
    source: 'https://shahidhussain.com/writing/search-for-salvage/'
  },
  '49991227': {
    summary: 'Chrome 155 မှစ၍ JPEG XL (.jxl) image decoding support ကို Chrome တွင် ထည့်သွင်းမည်ဟု Chrome for Developers က ကြေညာထားသည်။ JPEG နှင့် နှိုင်းယှဉ်လျှင် 30–50% ပိုမိုချုံ့နိုင်ခြင်း၊ lossless compression၊ HDR support နှင့် JPEG ကို losslessly transcode လုပ်နိုင်ခြင်းတို့ကို format ၏ အင်္ဂါရပ်အဖြစ် ဖော်ပြထားသည်။',
    context: 'Chrome တွင် အသုံးပြုမည့် decoder သည် Rust ဖြင့်ရေးသားသော jxl-rs ဖြစ်သည်။ Browser image decoder များသည် network မှ မယုံကြည်ရသော binary data ကို process လုပ်သဖြင့် memory safety သည် အရေးကြီးသည်။ SIMD optimization ကို Rust ဖြင့် လုံခြုံစွာ အသုံးပြုနိုင်ရန် jxl_simd abstraction ကိုလည်း တည်ဆောက်ထားကြောင်း post က ရှင်းပြသည်။',
    bullets: ['Chrome အဖွဲ့က performance၊ fuzzing နှင့် security စစ်ဆေးမှုများကို ဖော်ပြထားသော်လည်း၊ “memory-safety bug မတွေ့” ဟူသည့်အချက်သည် ၎င်းတို့၏ project အတွေ့အကြုံအစီရင်ခံချက်ဖြစ်သည်။', 'အသုံးချရာတွင် AVIF နှင့် JPEG XL နှစ်မျိုးလုံးကို စမ်းသပ်ပြီး မိမိအကြောင်းအရာအတွက် ရလဒ်ကောင်းဆုံးကို ရွေးရန် Chrome က အကြံပြုထားသည်။'],
    sourceNote: 'Chrome for Developers ၏ 2026-10-06 နည်းပညာဆောင်းပါး။',
    source: 'https://developer.chrome.com/blog/jpeg-xl-in-chrome'
  },
  '49994443': {
    summary: 'Bigwords.page သည် URL တစ်ခုတည်းမှ full-screen sign၊ message နှင့် timer ပြသနိုင်သည့် web app ဖြစ်သည်။ မူရင်းစာမျက်နှာက account သို့မဟုတ် app မလိုဘဲ URL ကို share သို့မဟုတ် bookmark လုပ်ရုံဖြင့် ပြသနိုင်ပြီး server ပေါ်တွင် အချက်အလက်မသိမ်းဟု ဖော်ပြထားသည်။',
    context: 'စာသားကို URL fragment ထဲတွင်ထားပြီး `||` ဖြင့် slide ခွဲခြင်း၊ `&key=value` ဖြင့် အရောင်၊ font၊ timer စသည့် setting များပြောင်းခြင်းကို docs က သရုပ်ပြထားသည်။ Arrival sign၊ quiz countdown နှင့် café Wi-Fi ကတ်တို့ကို အသုံးပြုပုံဥပမာပေးထားသည်။',
    bullets: ['URL ကိုယ်တိုင်က content နှင့် settings ကို သယ်ဆောင်သဖြင့် အလွယ်တကူမျှဝေနိုင်သည်။', 'Link ထဲတွင် ပြသမည့်အချက်အလက် ထည့်မည်ဆိုလျှင် URL ကိုရရှိသူတိုင်း ဖတ်နိုင်ကြောင်း သတိပြုပါ။'],
    sourceNote: 'Bigwords.page မူရင်းစာမျက်နှာနှင့် ၎င်း၏ inline documentation ကို ဖတ်ရှုထားသည်။',
    source: 'https://bigwords.page/'
  },
  '49966866': {
    summary: 'Docker Agent သည် YAML ဖြင့်ကြေညာထားသော configuration မှ AI Agent များကို တည်ဆောက်၊ run နှင့် share လုပ်ရန် ရည်ရွယ်သည့် Docker CLI plugin ဖြစ်သည်။ README က `docker agent` command၊ Agent များအတွက် tools နှင့် multi-agent delegation ကို အဓိကထားဖော်ပြသည်။',
    context: 'Agent များကို OpenAI၊ Anthropic၊ Gemini၊ AWS Bedrock၊ Mistral၊ xAI နှင့် Docker Model Runner ကဲ့သို့ provider များနှင့် အသုံးပြုနိုင်သည်ဟု README တွင် ဖော်ပြထားသည်။ Tool ချိတ်ဆက်မှုအတွက် MCP၊ retrieval အတွက် BM25/embedding/hybrid search နှင့် reranking၊ agent package များကို OCI registry ဖြင့် မျှဝေခြင်းတို့ကို ထောက်ပံ့ပေးသည်။',
    bullets: ['Agent definition ကို YAML အဖြစ်သိမ်းခြင်းက review လုပ်ရန်၊ version ထိန်းရန်နှင့် share လုပ်ရန် အဆင်ပြေစေသည်။', 'API key သတ်မှတ်ခြင်း သို့မဟုတ် local model provider အသုံးပြုခြင်း လိုအပ်သည်။', 'သုံးစွဲမည့် Model provider၊ tool permissions နှင့် telemetry အပြုအမူကို deployment မတိုင်မီ စစ်ဆေးပါ။'],
    sourceNote: 'Docker Agent GitHub repository README ကို တိုက်ရိုက်ဖတ်ရှုထားသည်။',
    source: 'https://github.com/docker/docker-agent'
  }
};

function safeUrl(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}
function storyCard(item, rank) {
  const row = element('article', 'story');
  row.append(element('span', 'rank', String(rank).padStart(2, '0')));
  const main = element('div', 'story-main');
  const top = element('div', 'story-top');
  const title = element('a', 'story-title', item.title || 'ခေါင်းစဉ်မရှိသော သတင်း');
  const storyUrl = safeUrl(item.url);
  title.href = storyUrl || `https://news.ycombinator.com/item?id=${encodeURIComponent(item.id)}`;
  title.target = '_blank'; title.rel = 'noopener noreferrer';
  top.append(title);
  const stats = element('div', 'story-stats');
  const points = element('span', 'stat');
  points.append(element('strong', '', String(item.score ?? 0)), document.createTextNode(' pts'));
  const comments = element('span', 'stat');
  comments.append(element('strong', '', String(item.descendants ?? 0)), document.createTextNode(' မှတ်ချက်'));
  stats.append(points, comments);
  top.append(stats);
  main.append(top);
  if (storyUrl) {
    try { main.append(element('span', 'domain', new URL(storyUrl).hostname.replace(/^www\./, ''))); } catch {}
  }
  const detail = deepDives[String(item.id)];
  const expandable = element('details', 'deep');
  expandable.append(element('summary', '', detail ? 'အသေးစိတ်ဖတ်ရှုရန်' : 'အကျဉ်းချုပ်နှင့် ရင်းမြစ်ကန့်သတ်ချက်'));
  const body = element('div', 'deep-content');
  if (detail) {
    body.append(element('p', '', detail.summary));
    body.append(element('h3', '', 'နောက်ခံနှင့် အရေးပါမှု'));
    body.append(element('p', '', detail.context));
    body.append(element('h3', '', 'မှတ်သားရန်'));
    const list = document.createElement('ul');
    detail.bullets.forEach((text) => list.append(element('li', '', text)));
    body.append(list);
    body.append(element('p', 'source-note', detail.sourceNote));
  } else {
    body.append(element('p', '', `“${item.title || 'ဤသတင်း'}” သည် ယခု live Hacker News feed တွင် ပါဝင်နေသည်။ Hacker News API မှ ခေါင်းစဉ်၊ ရမှတ်၊ မှတ်ချက်အရေအတွက်နှင့် မူရင်းလင့်ခ်ကို တိုက်ရိုက်ရယူထားသည်။`));
    body.append(element('p', '', 'ဤကတ်အတွက် မူရင်းစာမျက်နှာ၏ အကြောင်းအရာကို အတည်ပြုဖတ်ရှုထားခြင်း မရှိသေးသဖြင့် ခေါင်းစဉ်ထက်ကျော်လွန်သော နည်းပညာအသေးစိတ်ကို မခန့်မှန်းထားပါ။ မူရင်းရင်းမြစ်နှင့် Hacker News ဆွေးနွေးချက်ကို အောက်ပါလင့်ခ်များမှ ဖတ်ရှုနိုင်သည်။'));
    body.append(element('p', 'source-note', 'ဤအကျဉ်းချုပ်သည် ခေါင်းစဉ်နှင့် live feed မက်တာဒေတာကိုသာ အခြေခံသည်။'));
  }
  const links = element('div', 'story-links');
  if (storyUrl) {
    const sourceLink = element('a', '', 'မူရင်းဆောင်းပါး ↗');
    sourceLink.href = storyUrl; sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer'; links.append(sourceLink);
  }
  const discussion = element('a', '', 'HN ဆွေးနွေးချက် ↗');
  discussion.href = `https://news.ycombinator.com/item?id=${encodeURIComponent(item.id)}`;
  discussion.target = '_blank'; discussion.rel = 'noopener noreferrer'; links.append(discussion);
  body.append(links); expandable.append(body); main.append(expandable); row.append(main);
  return row;
}
async function loadStories() {
  refreshButton.disabled = true;
  errorEl.hidden = true;
  storiesEl.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(`${API}/topstories.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HN feed returned ${response.status}`);
    const ids = await response.json();
    const items = await Promise.all(ids.slice(0, LIMIT).map(async (id) => {
      const result = await fetch(`${API}/item/${id}.json`, { cache: 'no-store' });
      if (!result.ok) return null;
      return result.json();
    }));
    const valid = items.filter((item) => item && item.type === 'story' && !item.deleted && !item.dead);
    if (!valid.length) throw new Error('HN returned no stories');
    const fragment = document.createDocumentFragment();
    valid.forEach((item, index) => fragment.append(storyCard(item, index + 1)));
    storiesEl.replaceChildren(fragment);
    countEl.textContent = `${valid.length} ပုဒ်`;
    updatedEl.textContent = `နောက်ဆုံးရယူချိန် ${new Intl.DateTimeFormat('my-MM', { hour: 'numeric', minute: '2-digit' }).format(new Date())}`;
  } catch (error) {
    console.error('Unable to load Hacker News stories:', error);
    if (!storiesEl.querySelector('.story')) errorEl.hidden = false;
    updatedEl.textContent = 'Feed ကို ယာယီရယူမရပါ';
  } finally {
    storiesEl.setAttribute('aria-busy', 'false');
    refreshButton.disabled = false;
  }
}
refreshButton.addEventListener('click', loadStories);
loadStories();
