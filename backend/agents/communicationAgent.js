const templates = {
  flood: {
    en: "FLOOD ALERT: River level critical near {location}. Evacuate to nearest shelter immediately.",
    hi: "बाढ़ चेतावनी: {location} के पास जलस्तर खतरनाक। तुरंत आश्रय पर जाएं।",
    mr: "पूर इशारा: {location} जवळ पाणी धोकादायक. त्वरित निवारा केंद्रात जा.",
    ta: "வெள்ள எச்சரிக்கை: {location} அருகே நீர் மட்டம் ஆபத்து. உடனே பாதுகாப்பிடத்திற்கு செல்லவும்.",
    te: "వరద హెచ్చరిక: {location} దగ్గర నీటి మట్టం ప్రమాదకరం. వెంటనే ఆశ్రయానికి వెళ్లండి.",
    bn: "বন্যা সতর্কতা: {location} এর কাছে জলস্তর বিপজ্জনক। तुरंत आश्रयে যান।",
    gu: "પૂર ચેતવણી: {location} નજીક જળસ્તર ખતરનાક. તુરંત આશ્રય પર જાઓ.",
    kn: "ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ: {location} ಬಳಿ ನೀರಿನ ಮಟ್ಟ ಅಪಾಯಕಾರಿ. ತಕ್ಷಣ ಆಶ್ರಯಕ್ಕೆ ಹೋಗಿ.",
    ml: "പ്രളയ മുന്നറിയിപ്പ്: {location} സമീപം ജലനിരപ്പ് അപകടകരം. ഉടൻ സുരക്ഷിത സ്ഥലത്തേക്ക് പോകുക.",
    pa: "ਹੜ੍ਹ ਚੇਤਾਵਨੀ: {location} ਨੇੜੇ ਪਾਣੀ ਦਾ ਪੱਧਰ ਖਤਰਨਾਕ। ਤੁਰੰਤ ਸ਼ਰਨ ਵਿੱਚ ਜਾਓ।"
  },
  earthquake: {
    en: "EARTHQUAKE ALERT: {location} - {magnitude} Richter. Drop, Cover, Hold. Move to open safe zones.",
    hi: "भूकंप चेतावनी: {location} में {magnitude} तीव्रता। खुले स्थान पर जाएं।",
    mr: "भूकंप इशारा: {location} येथे {magnitude} रिश्टर. मोकळ्या जागेत जा.",
    ta: "நிலநடுக்க எச்சரிக்கை: {location} இல் {magnitude} ரிக்டர். திறந்தவெளிக்கு செல்லவும்.",
    te: "భూకంప హెచ్చరిక: {location} లో {magnitude} రిక్టర్. బహిరంగ ప్రదేశానికి వెళ్లండి.",
    bn: "ভূমিকম্প সতর্কতা: {location} এ {magnitude} রিখটার। খোলা জায়গায় যান।",
    gu: "ભૂકંપ ચેતવણી: {location} માં {magnitude} રિક્ટર. ખુલ્લી જગ્યામાં જાઓ.",
    kn: "ಭೂಕಂಪ ಎಚ್ಚರಿಕೆ: {location} ನಲ್ಲಿ {magnitude} ರಿಕ್ಟರ್. ತೆರೆದ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ.",
    ml: "ഭൂകമ്പ മുന്നറിയിപ്പ്: {location} ൽ {magnitude} റിക്ടർ. തുറന്ന സ്ഥലത്തേക്ക് പോകുക.",
    pa: "ਭੂਚਾਲ ਚੇਤਾਵਨੀ: {location} ਵਿੱਚ {magnitude} ਰਿਕਟਰ। ਖੁੱਲ੍ਹੀ ਥਾਂ ਤੇ ਜਾਓ।"
  },
  cyclone: {
    en: "CYCLONE WARNING: Severe storm approaching {location}. Stay indoors, away from coast.",
    hi: "चक्रवात चेतावनी: {location} में तूफान। घर में रहें।",
    mr: "वादळ इशारा: {location} मध्ये चक्रीवादळ. घरात थांबा.",
    ta: "சூறாவளி எச்சரிக்கை: {location} நோக்கி கடும் புயல். வீட்டிற்குள் இருங்கள்.",
    te: "తుఫాను హెచ్చరిక: {location} వైపు తీవ్ర తుఫాను. ఇంట్లోనే ఉండండి.",
    bn: "ঘূর্ণিঝড় সতর্কতা: {location} এর দিকে প্রবল ঝড়। ঘরে থাকুন।",
    gu: "ચક્રવાત ચેતવણી: {location} તરફ ગંભીર તોફાન. ઘરમાં રહો.",
    kn: "ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆ: {location} ಕಡೆಗೆ ತೀವ್ರ ಚಂಡಮಾರುತ. ಮನೆಯೊಳಗೆ ಇರಿ.",
    ml: "ചുഴലിക്കാറ്റ് മുന്നറിയിപ്പ്: {location} ലേക്ക് ശക്തമായ കൊടുങ്കാറ്റ്. വീടിനുള്ളിൽ തുടരുക.",
    pa: "ਚੱਕਰਵਾਤ ਚੇਤਾਵਨੀ: {location} ਵੱਲ ਗੰਭੀਰ ਤੂਫਾਨ। ਘਰ ਦੇ ਅੰਦਰ ਰਹੋ।"
  },
  wildfire: {
    en: "WILDFIRE ALERT: Fire near {location}. Evacuate upwind immediately.",
    hi: "जंगल आग चेतावनी: {location} के पास आग। तुरंत सुरक्षित स्थान पर जाएं।",
    mr: "वणवा इशारा: {location} जवळ आग. सुरक्षित ठिकाणी जा.",
    ta: "காட்டுத்தீ எச்சரிக்கை: {location} அருகே தீ. உடனே வெளியேறவும்.",
    te: "అడవి మంట హెచ్చరిక: {location} దగ్గర మంట. వెంటనే ఖాళీ చేయండి.",
    bn: "দাবানল সতর্কতা: {location} এর কাছে আগুন। तुरंत সরে যান।",
    gu: "જંગલ આગ ચેતવણી: {location} નજીક આગ. તુરંત ખાલી કરો.",
    kn: "ಕಾಡ್ಗಿಚ್ಚು ಎಚ್ಚರಿಕೆ: {location} ಬಳಿ ಬೆಂಕಿ. ತಕ್ಷಣ ಸ್ಥಳಾಂತರಿಸಿ.",
    ml: "കാട്ടുതീ മുന്നറിയിപ്പ്: {location} സമീപം തീ. ഉടൻ ഒഴിഞ്ഞുപോകുക.",
    pa: "ਜੰਗਲੀ ਅੱਗ ਚੇਤਾਵਨੀ: {location} ਨੇੜੇ ਅੱਗ। ਤੁਰੰਤ ਖਾਲੀ ਕਰੋ।"
  },
  landslide: {
    en: "LANDSLIDE ALERT: Slope failure risk at {location}. Avoid hillside routes.",
    hi: "भूस्खलन चेतावनी: {location} में पहाड़ खिसकने का खतरा।",
    mr: "दरड इशारा: {location} येथे धोका. डोंगर रस्ते टाळा.",
    ta: "நிலச்சரிவு எச்சரிக்கை: {location} இல் ஆபத்து. மலை பாதைகளை தவிர்க்கவும்.",
    te: "కొండచరియ హెచ్చరిక: {location} లో ప్రమాదం. కొండ మార్గాలను నివారించండి.",
    bn: "ভূমিধস সতর্কতা: {location} এ ঝুঁকি। পাহাড়ি রাস্তা এড়িয়ে চলুন।",
    gu: "ભૂસ્ખલન ચેતવણી: {location} માં જોખમ. પહાડી રસ્તા ટાળો.",
    kn: "ಭೂಕುಸಿತ ಎಚ್ಚರಿಕೆ: {location} ನಲ್ಲಿ ಅಪಾಯ. ಗುಡ್ಡದ ಮಾರ್ಗಗಳನ್ನು ತಪ್ಪಿಸಿ.",
    ml: "മണ്ണിടിച്ചിൽ മുന്നറിയിപ്പ്: {location} ൽ അപകടം. മലമ്പാതകൾ ഒഴിവാക്കുക.",
    pa: "ਜ਼ਮੀਨ ਖਿਸਕਣ ਚੇਤਾਵਨੀ: {location} ਵਿੱਚ ਖਤਰਾ। ਪਹਾੜੀ ਰਸਤੇ ਤੋਂ ਬਚੋ।"
  },
  heatwave: {
    en: "HEATWAVE ALERT: Extreme heat in {location}. Stay hydrated, avoid outdoors 12-4 PM.",
    hi: "लू चेतावनी: {location} में भीषण गर्मी। पानी पिएं, बाहर न जाएं।",
    mr: "उष्माघात इशारा: {location} मध्ये प्रचंड उष्णता. पाणी प्या.",
    ta: "வெப்ப அலை எச்சரிக்கை: {location} இல் கடும் வெப்பம். தண்ணீர் குடிக்கவும்.",
    te: "వడగాడ్పు హెచ్చరిక: {location} లో తీవ్ర వేడి. నీరు త్రాగండి, బయటకు వెళ్లవద్దు.",
    bn: "তাপপ্রবাহ সতর্কতা: {location} এ প্রচন্ড গরম। জল পান করুন।",
    gu: "હીટવેવ ચેતવણી: {location} માં ભારે ગરમી. પાણી પીઓ.",
    kn: "ಶಾಖದ ಅಲೆ ಎಚ್ಚರಿಕೆ: {location} ನಲ್ಲಿ ತೀವ್ರ ಬಿಸಿ. ನೀರು ಕುಡಿಯಿರಿ.",
    ml: "ഉഷ്ണതരംഗ മുന്നറിയിപ്പ്: {location} ൽ കടുത്ത ചൂട്. വെള്ളം കുടിക്കുക.",
    pa: "ਹੀਟਵੇਵ ਚੇਤਾਵਨੀ: {location} ਵਿੱਚ ਭਿਆਨਕ ਗਰਮੀ। ਪਾਣੀ ਪੀਓ।"
  }
};

function composeAlert(incident, lang='en') {
  const t = templates[incident.type] || templates.flood;
  let msg = (t[lang] || t.en).replace('{location}', incident.location).replace('{magnitude}', '4.8');
  return { id: 'ALT-' + Date.now() + '-' + lang, incidentId: incident.incidentId, type: incident.type, lang, message: msg, severity: incident.severity, timestamp: new Date(), channels: ['app','sms','siren'] };
}
module.exports = { composeAlert, templates };
