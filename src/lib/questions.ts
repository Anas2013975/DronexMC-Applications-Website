export type Category = 'administration'|'media'|'development';
export type Lang = 'en'|'ar';
export type Question = { key: string; en: string; ar: string; required?: boolean; type?: 'text'|'textarea'|'url'|'number' };
export const CATEGORIES: {key:Category; en:string; ar:string; descriptionEn:string; descriptionAr:string; questions:Question[]}[] = [
  { key:'administration', en:'Administration Team', ar:'فريق الإدارة', descriptionEn:'Help moderate and support the community.', descriptionAr:'ساعد في إدارة المجتمع ودعم أعضائه.', questions:[
    {key:'age',en:'How old are you?',ar:'كم عمرك؟',type:'number'},
    {key:'minecraft',en:'What is your Minecraft username?',ar:'ما اسمك في ماينكرافت؟'},
    {key:'timezone',en:'What is your timezone?',ar:'ما منطقتك الزمنية؟'},
    {key:'experience',en:'Describe your previous staff experience.',ar:'اشرح خبرتك السابقة في الإدارة.',type:'textarea'},
    {key:'availability',en:'How many hours can you be active weekly?',ar:'كم ساعة يمكنك التواجد أسبوعيًا؟'},
    {key:'motivation',en:'Why do you want to join the Administration Team?',ar:'لماذا تريد الانضمام إلى فريق الإدارة؟',type:'textarea'},
    {key:'scenario',en:'How would you handle a player breaking the rules?',ar:'كيف ستتعامل مع لاعب يخالف القوانين؟',type:'textarea'}
  ]},
  { key:'media', en:'Media Team', ar:'فريق الإعلام', descriptionEn:'Create videos, art, and community content.', descriptionAr:'أنشئ فيديوهات وتصاميم ومحتوى للمجتمع.', questions:[
    {key:'age',en:'How old are you?',ar:'كم عمرك؟',type:'number'},
    {key:'minecraft',en:'What is your Minecraft username?',ar:'ما اسمك في ماينكرافت؟'},
    {key:'portfolio',en:'Share a link to your portfolio or channel.',ar:'أرسل رابط أعمالك أو قناتك.',type:'url'},
    {key:'tools',en:'Which editing or design tools do you use?',ar:'ما برامج المونتاج أو التصميم التي تستخدمها؟'},
    {key:'experience',en:'Describe your content creation experience.',ar:'اشرح خبرتك في صناعة المحتوى.',type:'textarea'},
    {key:'ideas',en:'What content would you create for DronexMC?',ar:'ما المحتوى الذي ستقدمه لـ DronexMC؟',type:'textarea'}
  ]},
  { key:'development', en:'Development Team', ar:'فريق التطوير', descriptionEn:'Build, maintain, and improve the network.', descriptionAr:'طوّر الشبكة وحسّن خدماتها.', questions:[
    {key:'age',en:'How old are you?',ar:'كم عمرك؟',type:'number'},
    {key:'minecraft',en:'What is your Minecraft username?',ar:'ما اسمك في ماينكرافت؟'},
    {key:'languages',en:'Which programming languages or tools do you know?',ar:'ما لغات البرمجة أو الأدوات التي تعرفها؟',type:'textarea'},
    {key:'portfolio',en:'Share a GitHub or portfolio link.',ar:'أرسل رابط GitHub أو معرض أعمالك.',type:'url'},
    {key:'experience',en:'Describe a project you have worked on.',ar:'اشرح مشروعًا عملت عليه.',type:'textarea'},
    {key:'motivation',en:'Why do you want to develop for DronexMC?',ar:'لماذا تريد التطوير لـ DronexMC؟',type:'textarea'}
  ]}
];
