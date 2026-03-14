import React, { useEffect, useMemo, useState } from "react";
import {
  Cable,
  CaseSensitive,
  CheckCircle2,
  CreditCard,
  Globe,
  Headphones,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
  Trash2,
  Truck,
  Upload,
  UserCog,
  Wrench,
  X,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/972543347430";
const STORE_ADDRESS = "بقعاثا • هضبة الجولان";
const STORAGE_KEYS = {
  products: "smartlab-products",
  admin: "smartlab-admin",
  orders: "smartlab-orders",
  reviews: "smartlab-reviews",
};
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
const LOGIN_BLOCK_MS = 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const DEFAULT_ADMIN = {
  username: "admin",
  passwordHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
};
const EMPTY_LOGIN = { username: "", password: "" };
const EMPTY_REVIEW = { name: "", rating: 5, commentAr: "", commentHe: "" };
const EMPTY_CHECKOUT = {
  customerName: "",
  phone: "",
  city: "بقعاثا",
  address: "",
  paymentMethod: "card",
  cardNumber: "",
  expiry: "",
  cvv: "",
};
const EMPTY_PRODUCT = {
  nameHe: "",
  nameAr: "",
  category: "phones",
  brand: "SmartLab",
  price: "",
  oldPrice: "",
  image: "/smartlab-logo.png",
  featured: false,
  badgeHe: "חדש",
  badgeAr: "جديد",
};

const DEFAULT_PRODUCTS = [
  { id: 1, nameHe: "iPhone 15 Pro Max", nameAr: "آيفون 15 برو ماكس", category: "phones", brand: "Apple", price: "₪4,899", oldPrice: "₪5,199", image: "/smartlab-logo.png", featured: true, badgeHe: "מבצע", badgeAr: "عرض" },
  { id: 2, nameHe: "Samsung Galaxy S24 Ultra", nameAr: "سامسونج جالكسي S24 ألترا", category: "phones", brand: "Samsung", price: "₪4,299", oldPrice: "₪4,599", image: "/smartlab-logo.png", featured: true, badgeHe: "חדש", badgeAr: "جديد" },
  { id: 3, nameHe: "מטען מהיר 45W", nameAr: "شاحن سريع 45 واط", category: "chargers", brand: "SmartLab", price: "₪99", oldPrice: "₪129", image: "/smartlab-logo.png", featured: false, badgeHe: "נמכר חזק", badgeAr: "الأكثر مبيعًا" },
  { id: 4, nameHe: "כיסוי מגנטי פרימיום", nameAr: "غطاء مغناطيسي فاخر", category: "cases", brand: "SmartLab", price: "₪69", oldPrice: "₪89", image: "/smartlab-logo.png", featured: false, badgeHe: "מומלץ", badgeAr: "موصى به" },
  { id: 5, nameHe: "אוזניות אלחוטיות Pro", nameAr: "سماعات لاسلكية برو", category: "audio", brand: "SmartLab", price: "₪179", oldPrice: "₪229", image: "/smartlab-logo.png", featured: true, badgeHe: "איכות גבוהה", badgeAr: "جودة عالية" },
  { id: 6, nameHe: "מגן מסך Nano Glass", nameAr: "حماية شاشة نانو جلاس", category: "protection", brand: "SmartLab", price: "₪39", oldPrice: "₪49", image: "/smartlab-logo.png", featured: false, badgeHe: "הגנה", badgeAr: "حماية" },
];

const DEFAULT_REVIEWS = [
  { id: 1, name: "Ahmad", rating: 5, commentAr: "خدمة ممتازة وسريعة، والمنتج وصل بحالة رائعة.", commentHe: "שירות מעולה ומהיר, והמוצר הגיע במצב מצוין." },
  { id: 2, name: "Lina", rating: 5, commentAr: "أسعار جيدة وتعامل محترم جدًا.", commentHe: "מחירים טובים ויחס מכבד מאוד." },
  { id: 3, name: "Sami", rating: 4, commentAr: "تجربة شراء سهلة وواضحة داخل الموقع.", commentHe: "חוויית קנייה פשוטה וברורה באתר." },
];

const DICT = {
  he: {
    dir: "rtl",
    switchLabel: "العربية",
    nav: [
      { key: "home", label: "ראשי" },
      { key: "products", label: "מוצרים" },
      { key: "accessories", label: "אביזרים" },
      { key: "repair", label: "מעבדה" },
      { key: "contact", label: "צור קשר" },
    ],
    heroBadge: "חנות ומעבדת סלולר ברמה מקצועית",
    heroTitle: "טלפונים, אביזרים ותיקונים במקום אחד",
    heroText: "SmartLab היא חנות דיגיטלית מתקדמת למכירת סמארטפונים, כיסויים, מטענים, מגני מסך, אוזניות ושירותי תיקון מקצועיים עם חוויית שימוש מודרנית ומהירה.",
    primaryBtn: "התחל לקנות",
    secondaryBtn: "צור קשר בוואטסאפ",
    searchPlaceholder: "חפש טלפונים או אביזרים...",
    featuredTitle: "מוצרים נבחרים",
    categoriesTitle: "קטגוריות עיקריות",
    categoriesSubtitle: "ניווט ברור ונוח כדי להגיע מהר למה שהלקוח צריך.",
    servicesTitle: "למה לבחור ב-SmartLab",
    productsTitle: "מגוון מוצרים מקצועי",
    productsSubtitle: "טכנולוגיה, אביזרים ופתרונות הגנה בסטנדרט גבוה.",
    addToCart: "הוסף לסל",
    all: "הכל",
    phones: "טלפונים",
    chargers: "מטענים",
    cases: "כיסויים",
    audio: "אודיו",
    protection: "הגנה",
    repairTitle: "מעבדת תיקונים מקצועית",
    repairText: "החלפת מסכים, סוללות, שקעי טעינה ותיקוני תוכנה לשירות מהיר ואמין.",
    contactTitle: "דברו איתנו",
    contactText: "זמינים להזמנות, תיקונים וייעוץ לפני רכישה.",
    footer: "כל הזכויות שמורות",
    orderNow: "הזמן עכשיו",
    checkoutTitle: "השלמת הזמנה",
    checkoutSubtitle: "מילוי פרטי לקוח, משלוח ותשלום.",
    customerName: "שם מלא",
    phoneLabel: "מספר טלפון",
    cityLabel: "עיר / אזור",
    addressLabel: "כתובת",
    payOnline: "תשלום אונליין",
    cashOnDelivery: "תשלום במסירה",
    cardNumber: "מספר כרטיס",
    expiry: "תוקף",
    cvv: "CVV",
    placeOrder: "אשר הזמנה",
    trackingTitle: "מעקב הזמנות",
    trackingPlaceholder: "הזן קוד הזמנה",
    trackOrder: "בדוק סטטוס",
    orderCode: "קוד הזמנה",
    orderStatus: "סטטוס",
    orderItems: "פריטים",
    uploadImage: "העלה תמונה אמיתית",
    reviewsTitle: "חוות דעת לקוחות",
    addReview: "הוסף חוות דעת",
    yourName: "שמך",
    submitReview: "שלח חוות דעת",
    addedToCart: "המוצר נוסף לעגלה",
    orderSuccess: "ההזמנה נוצרה בהצלחה",
    admin: "ניהול",
    adminTitle: "לוח ניהול",
    adminSubtitle: "עדכון מוצרים, מחירים, תמונות ופרטי כניסה.",
    username: "שם משתמש",
    password: "סיסמה",
    login: "התחבר",
    logout: "התנתק",
    wrongLogin: "שם המשתמש או הסיסמה שגויים",
    changeLoginTitle: "פרטי התחברות",
    productNameHe: "שם מוצר בעברית",
    productNameAr: "שם מוצר בערבית",
    productBrand: "מותג",
    productPrice: "מחיר",
    productOldPrice: "מחיר קודם",
    productImage: "קישור לתמונה",
    featured: "מוצר נבחר",
    delete: "מחק",
    addNewProduct: "הוסף מוצר חדש",
    addProduct: "הוסף מוצר",
    saveAccess: "הפרטים נשמרים מקומית בדפדפן",
    emptyField: "יש למלא שם מוצר ומחיר",
    whatsapp: "וואטסאפ",
    location: "מיקום החנות",
    ratingLabel: "דירוג",
    emptyCart: "אין מוצרים בסל",
    orderValidation: "יש למלא פרטי הזמנה ולהוסיף מוצרים",
    links: "קישורים מהירים",
    blockedLogin: "יותר מדי ניסיונות, נסה שוב בעוד רגע",
    secureUpdate: "פרטי ההתחברות עודכנו בצורה בטוחה",
    badImage: "יש לבחור תמונה בטוחה ובגודל קטן מ-2MB",
    weakPassword: "נדרש שם משתמש וסיסמה של לפחות 4 תווים",
  },
  ar: {
    dir: "rtl",
    switchLabel: "עברית",
    nav: [
      { key: "home", label: "الرئيسية" },
      { key: "products", label: "المنتجات" },
      { key: "accessories", label: "الإكسسوارات" },
      { key: "repair", label: "الصيانة" },
      { key: "contact", label: "اتصل بنا" },
    ],
    heroBadge: "متجر ومختبر هواتف بمستوى احترافي",
    heroTitle: "هواتف، إكسسوارات وصيانة في مكان واحد",
    heroText: "SmartLab متجر إلكتروني احترافي لبيع الهواتف الذكية، الأغطية، الشواحن، لواصق الحماية، السماعات وخدمات الصيانة، مع تجربة استخدام سريعة وأنيقة.",
    primaryBtn: "ابدأ التسوق",
    secondaryBtn: "تواصل واتساب",
    searchPlaceholder: "ابحث عن هاتف أو إكسسوار...",
    featuredTitle: "منتجات مميزة",
    categoriesTitle: "الأقسام الرئيسية",
    categoriesSubtitle: "تنقل واضح وسهل للوصول السريع إلى ما يحتاجه العميل.",
    servicesTitle: "لماذا تختار SmartLab",
    productsTitle: "تشكيلة منتجات احترافية",
    productsSubtitle: "تقنية، إكسسوارات وحلول حماية بمعيار عالي.",
    addToCart: "أضف إلى السلة",
    all: "الكل",
    phones: "هواتف",
    chargers: "شواحن",
    cases: "أغطية",
    audio: "صوتيات",
    protection: "حماية",
    repairTitle: "مختبر صيانة احترافي",
    repairText: "تبديل شاشات، بطاريات، مداخل شحن وإصلاحات برمجية بخدمة سريعة وموثوقة.",
    contactTitle: "تواصل معنا",
    contactText: "متوفرون للطلبات، الصيانة والاستشارة قبل الشراء.",
    footer: "جميع الحقوق محفوظة",
    orderNow: "اطلب الآن",
    checkoutTitle: "إتمام الطلب",
    checkoutSubtitle: "إدخال بيانات العميل، الشحن والدفع.",
    customerName: "الاسم الكامل",
    phoneLabel: "رقم الهاتف",
    cityLabel: "المدينة / المنطقة",
    addressLabel: "العنوان",
    payOnline: "الدفع أونلاين",
    cashOnDelivery: "الدفع عند الاستلام",
    cardNumber: "رقم البطاقة",
    expiry: "تاريخ الانتهاء",
    cvv: "CVV",
    placeOrder: "تأكيد الطلب",
    trackingTitle: "تتبع الطلبات",
    trackingPlaceholder: "أدخل كود الطلب",
    trackOrder: "فحص الحالة",
    orderCode: "كود الطلب",
    orderStatus: "الحالة",
    orderItems: "المنتجات",
    uploadImage: "ارفع صورة حقيقية",
    reviewsTitle: "تقييمات الزبائن",
    addReview: "أضف تقييم",
    yourName: "اسمك",
    submitReview: "إرسال التقييم",
    addedToCart: "تمت إضافة المنتج إلى السلة",
    orderSuccess: "تم إنشاء الطلب بنجاح",
    admin: "الإدارة",
    adminTitle: "لوحة الإدارة",
    adminSubtitle: "تحديث المنتجات والأسعار والصور وبيانات الدخول.",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    wrongLogin: "اسم المستخدم أو كلمة المرور غير صحيحين",
    changeLoginTitle: "بيانات الدخول",
    productNameHe: "اسم المنتج بالعبرية",
    productNameAr: "اسم المنتج بالعربية",
    productBrand: "العلامة التجارية",
    productPrice: "السعر",
    productOldPrice: "السعر السابق",
    productImage: "رابط الصورة",
    featured: "منتج مميز",
    delete: "حذف",
    addNewProduct: "إضافة منتج جديد",
    addProduct: "إضافة المنتج",
    saveAccess: "يتم حفظ البيانات محليًا في المتصفح",
    emptyField: "يجب تعبئة اسم المنتج والسعر",
    whatsapp: "واتساب",
    location: "موقع المتجر",
    ratingLabel: "التقييم",
    emptyCart: "لا توجد منتجات في السلة",
    orderValidation: "يجب تعبئة بيانات الطلب وإضافة منتجات",
    links: "روابط سريعة",
    blockedLogin: "محاولات كثيرة، حاول بعد قليل",
    secureUpdate: "تم تحديث بيانات الدخول بأمان",
    badImage: "يجب اختيار صورة آمنة وبحجم أقل من 2MB",
    weakPassword: "اسم المستخدم مطلوب وكلمة المرور 4 أحرف على الأقل",
  },
};

const CATEGORY_CARD_META = [
  { key: "phones", icon: Smartphone },
  { key: "cases", icon: CaseSensitive },
  { key: "chargers", icon: Cable },
  { key: "protection", icon: ShieldCheck },
];

const SERVICE_CARD_META = [Truck, Star, Wrench, Headphones];

const cn = (...v) => v.filter(Boolean).join(" ");
const sanitizeText = (value) => String(value ?? "").replace(/[<>]/g, "").trimStart();
const textByLang = (lang, ar, he) => (lang === "he" ? he : ar);
const parsePrice = (value) => Number(String(value || "0").replace(/[^\d.]/g, "")) || 0;
const createOrderCode = () => `SL-${Date.now().toString().slice(-6)}`;
const isSafeImageFile = (file) => Boolean(file && file.type.startsWith("image/") && file.size <= MAX_IMAGE_SIZE);

async function sha256(value) {
  const bytes = new TextEncoder().encode(String(value));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const TESTS = [
  parsePrice("₪4,899") === 4899,
  parsePrice("₪99") === 99,
  createOrderCode().startsWith("SL-"),
  DEFAULT_ADMIN.passwordHash.length === 64,
].every(Boolean);

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function useStoredState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  useEffect(() => setState(read(key, initialValue)), [key]);
  useEffect(() => write(key, state), [key, state]);
  return [state, setState];
}

function Field({ as = "input", className = "", ...props }) {
  const Comp = as;
  return <Comp className={cn("w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none", className)} {...props} />;
}

function IconButton({ children, className = "", ...props }) {
  return <button className={cn("rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold", className)} {...props}>{children}</button>;
}

export default function SmartLabStore() {
  const [lang, setLang] = useState("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginBlockedUntil, setLoginBlockedUntil] = useState(0);
  const [credentials, setCredentials] = useStoredState(STORAGE_KEYS.admin, DEFAULT_ADMIN);
  const [products, setProducts] = useStoredState(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  const [orders, setOrders] = useStoredState(STORAGE_KEYS.orders, []);
  const [reviews, setReviews] = useStoredState(STORAGE_KEYS.reviews, DEFAULT_REVIEWS);
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [credentialForm, setCredentialForm] = useState({ username: DEFAULT_ADMIN.username, password: "" });
  const [cartItems, setCartItems] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [orderLookup, setOrderLookup] = useState(null);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW);
  const [checkoutForm, setCheckoutForm] = useState(EMPTY_CHECKOUT);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);

  const t = DICT[lang];
  const isLoginBlocked = Date.now() < loginBlockedUntil;

  const categories = useMemo(
    () => [
      { key: "all", label: t.all },
      { key: "phones", label: t.phones },
      { key: "cases", label: t.cases },
      { key: "chargers", label: t.chargers },
      { key: "audio", label: t.audio },
      { key: "protection", label: t.protection },
    ],
    [t]
  );

  const categoryCards = useMemo(
    () => CATEGORY_CARD_META.map((item) => ({
      ...item,
      title: t[item.key],
      desc: textByLang(
        lang,
        item.key === "phones" ? "أحدث الأجهزة وأقواها" : item.key === "cases" ? "حماية وأناقة لكل أنواع الهواتف" : item.key === "chargers" ? "شحن سريع وآمن وموثوق" : "حفاظ على الشاشة بجودة ممتازة",
        item.key === "phones" ? "המכשירים החדשים והחזקים ביותר" : item.key === "cases" ? "הגנה ועיצוב לכל סוגי המכשירים" : item.key === "chargers" ? "טעינה מהירה, בטוחה ואמינה" : "שמירה על המסך ברמת פרימיום"
      ),
    })),
    [lang, t]
  );

  const serviceCards = useMemo(
    () => [
      { icon: SERVICE_CARD_META[0], title: textByLang(lang, "توصيل سريع", "משלוח מהיר"), desc: textByLang(lang, "خدمة سريعة للطلبات داخل المنطقة", "שירות מהיר להזמנות באזור") },
      { icon: SERVICE_CARD_META[1], title: textByLang(lang, "منتجات أصلية", "מוצרים מקוריים"), desc: textByLang(lang, "جودة عالية وضمان على منتجات متعددة", "איכות גבוהה ואחריות על מגוון מוצרים") },
      { icon: SERVICE_CARD_META[2], title: textByLang(lang, "مختبر محترف", "מעבדה מקצועית"), desc: textByLang(lang, "إصلاحات سوفت وير وهاردوير باحترافية", "תיקוני חומרה ותוכנה באמינות גבוהה") },
      { icon: SERVICE_CARD_META[3], title: textByLang(lang, "دعم كامل", "תמיכה מלאה"), desc: textByLang(lang, "استشارة قبل الشراء وبعده", "ייעוץ לפני קנייה ואחרי הרכישה") },
    ],
    [lang]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      const matchSearch = !q || [p.nameHe, p.nameAr, p.brand].some((v) => v.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [activeCategory, products, search]);

  const featuredProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 4), [products]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0), [cartItems]);
  const averageRating = useMemo(() => (reviews.length ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1) : "0.0"), [reviews]);

  useEffect(() => {
    setCredentialForm({ username: credentials.username, password: "" });
  }, [credentials.username]);

  useEffect(() => {
    if (!checkoutMessage) return undefined;
    const timer = window.setTimeout(() => setCheckoutMessage(""), 1800);
    return () => window.clearTimeout(timer);
  }, [checkoutMessage]);

  useEffect(() => {
    if (!isLoggedIn) return undefined;
    const timer = window.setTimeout(() => {
      setIsLoggedIn(false);
      setIsAdminOpen(false);
    }, SESSION_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn]);

  const toggleLanguage = () => setLang((v) => (v === "he" ? "ar" : "he"));
  const logout = () => {
    setIsLoggedIn(false);
    setIsAdminOpen(false);
    setLoginAttempts(0);
  };

  const patchProduct = (id, field, value) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const loadImage = (setter) => (event) => {
    const file = event.target.files?.[0];
    if (!isSafeImageFile(file)) {
      setCheckoutMessage(t.badImage);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result));
    reader.readAsDataURL(file);
  };

  const sanitizeProduct = (product) => ({
    ...product,
    nameHe: sanitizeText(product.nameHe),
    nameAr: sanitizeText(product.nameAr),
    brand: sanitizeText(product.brand),
    price: sanitizeText(product.price),
    oldPrice: sanitizeText(product.oldPrice),
    image: sanitizeText(product.image),
  });

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setCheckoutMessage(t.addedToCart);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoginBlocked) {
      setLoginError(t.blockedLogin);
      return;
    }
    const username = sanitizeText(loginForm.username);
    const passwordHash = await sha256(loginForm.password);
    const ok = username === credentials.username && passwordHash === credentials.passwordHash;
    if (!ok) {
      const nextAttempts = loginAttempts + 1;
      setLoginAttempts(nextAttempts);
      if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
        setLoginBlockedUntil(Date.now() + LOGIN_BLOCK_MS);
        setLoginAttempts(0);
      }
      setLoginError(t.wrongLogin);
      return;
    }
    setIsLoggedIn(true);
    setLoginAttempts(0);
    setLoginError("");
    setLoginForm(EMPTY_LOGIN);
  };

  const handleSaveCredentials = async () => {
    const username = sanitizeText(credentialForm.username);
    const password = credentialForm.password.trim();
    if (!username || password.length < 4) {
      setLoginError(t.weakPassword);
      return;
    }
    const passwordHash = await sha256(password);
    setCredentials({ username, passwordHash });
    setCredentialForm({ username, password: "" });
    setLoginError("");
    setCheckoutMessage(t.secureUpdate);
  };

  const handleAddProduct = () => {
    if (![newProduct.nameHe, newProduct.nameAr, newProduct.price].every((v) => String(v).trim())) {
      setLoginError(t.emptyField);
      return;
    }
    setProducts((prev) => [...prev, { ...sanitizeProduct(newProduct), id: Date.now() }]);
    setNewProduct(EMPTY_PRODUCT);
    setLoginError("");
  };

  const handlePlaceOrder = () => {
    if (!checkoutForm.customerName || !checkoutForm.phone || !checkoutForm.address || !cartItems.length) {
      setCheckoutMessage(t.orderValidation);
      return;
    }
    const order = {
      id: Date.now(),
      code: createOrderCode(),
      customerName: sanitizeText(checkoutForm.customerName),
      phone: sanitizeText(checkoutForm.phone),
      city: sanitizeText(checkoutForm.city),
      address: sanitizeText(checkoutForm.address),
      paymentMethod: checkoutForm.paymentMethod,
      total: `₪${cartTotal}`,
      statusHe: "בהכנה",
      statusAr: "قيد التجهيز",
      items: cartItems,
      createdAt: new Date().toLocaleString(),
    };
    setOrders((prev) => [order, ...prev]);
    setOrderLookup(order);
    setTrackingCode(order.code);
    setCartItems([]);
    setCheckoutOpen(false);
    setCheckoutForm(EMPTY_CHECKOUT);
    setCheckoutMessage(`${t.orderSuccess} - ${order.code}`);
  };

  const handleTrackOrder = () => {
    setOrderLookup(orders.find((o) => o.code.toLowerCase() === trackingCode.trim().toLowerCase()) || null);
  };

  const handleSubmitReview = () => {
    if (![reviewForm.name, reviewForm.commentAr, reviewForm.commentHe].every((v) => String(v).trim())) return;
    setReviews((prev) => [
      {
        ...reviewForm,
        id: Date.now(),
        name: sanitizeText(reviewForm.name),
        commentAr: sanitizeText(reviewForm.commentAr),
        commentHe: sanitizeText(reviewForm.commentHe),
        rating: Number(reviewForm.rating),
      },
      ...prev,
    ]);
    setReviewForm(EMPTY_REVIEW);
  };

  return (
    <div dir={t.dir} className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.14),transparent_26%)]" />
      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
            <img src="/smartlab-logo.png" alt="SmartLab" className="h-11 w-auto rounded-xl object-contain" />

            <nav className="hidden items-center gap-6 lg:flex">
              {t.nav.map((item) => (
                <a key={item.key} href={`#${item.key}`} className="text-sm text-slate-200 transition hover:text-cyan-300">{item.label}</a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <IconButton onClick={toggleLanguage} className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200"><Globe className="me-2 inline h-4 w-4" />{t.switchLabel}</IconButton>
              <IconButton onClick={() => setCheckoutOpen(true)}><ShoppingCart className="me-2 inline h-4 w-4" />{cartItems.length}</IconButton>
              {isLoggedIn && <IconButton onClick={() => setIsAdminOpen((v) => !v)} className="border-amber-400/30 bg-amber-400/10 text-amber-200"><UserCog className="me-2 inline h-4 w-4" />{t.admin}</IconButton>}
              {isLoggedIn && <IconButton onClick={logout}><LogOut className="me-2 inline h-4 w-4" />{t.logout}</IconButton>}
            </div>

            <button onClick={() => setMenuOpen((v) => !v)} className="rounded-2xl border border-white/10 bg-white/5 p-3 lg:hidden">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
              <div className="flex flex-col gap-3">
                {t.nav.map((item) => <a key={item.key} href={`#${item.key}`} className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200" onClick={() => setMenuOpen(false)}>{item.label}</a>)}
                <button onClick={toggleLanguage} className="rounded-xl bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200">{t.switchLabel}</button>
                <button onClick={() => setCheckoutOpen(true)} className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200">{t.orderNow} ({cartItems.length})</button>
              </div>
            </div>
          )}
        </header>

        <main className="mx-auto max-w-7xl px-4 md:px-8">
          {!TESTS && <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">Internal validation failed.</div>}
          {checkoutMessage && <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"><CheckCircle2 className="me-2 inline h-4 w-4" />{checkoutMessage}</div>}

          {checkoutOpen && (
            <section className="mt-8 rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5 p-6 shadow-2xl shadow-black/20">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div><h3 className="text-2xl font-black">{t.checkoutTitle}</h3><p className="mt-1 text-sm text-slate-400">{t.checkoutSubtitle}</p></div>
                <button onClick={() => setCheckoutOpen(false)} className="rounded-xl border border-white/10 bg-white/5 p-2"><X className="h-4 w-4" /></button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <Field value={checkoutForm.customerName} onChange={(e) => setCheckoutForm((p) => ({ ...p, customerName: sanitizeText(e.target.value) }))} placeholder={t.customerName} />
                  <Field value={checkoutForm.phone} onChange={(e) => setCheckoutForm((p) => ({ ...p, phone: sanitizeText(e.target.value) }))} placeholder={t.phoneLabel} />
                  <Field value={checkoutForm.city} onChange={(e) => setCheckoutForm((p) => ({ ...p, city: sanitizeText(e.target.value) }))} placeholder={t.cityLabel} />
                  <Field value={checkoutForm.address} onChange={(e) => setCheckoutForm((p) => ({ ...p, address: sanitizeText(e.target.value) }))} placeholder={t.addressLabel} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <button type="button" onClick={() => setCheckoutForm((p) => ({ ...p, paymentMethod: "card" }))} className={cn("rounded-2xl border px-4 py-3 text-sm font-semibold", checkoutForm.paymentMethod === "card" ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300")}><CreditCard className="me-2 inline h-4 w-4" />{t.payOnline}</button>
                    <button type="button" onClick={() => setCheckoutForm((p) => ({ ...p, paymentMethod: "cod" }))} className={cn("rounded-2xl border px-4 py-3 text-sm font-semibold", checkoutForm.paymentMethod === "cod" ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300")}>{t.cashOnDelivery}</button>
                  </div>
                  {checkoutForm.paymentMethod === "card" && (
                    <div className="grid gap-3 md:grid-cols-3">
                      <Field value={checkoutForm.cardNumber} onChange={(e) => setCheckoutForm((p) => ({ ...p, cardNumber: e.target.value }))} placeholder={t.cardNumber} className="md:col-span-3" />
                      <Field value={checkoutForm.expiry} onChange={(e) => setCheckoutForm((p) => ({ ...p, expiry: e.target.value }))} placeholder={t.expiry} />
                      <Field value={checkoutForm.cvv} onChange={(e) => setCheckoutForm((p) => ({ ...p, cvv: e.target.value }))} placeholder={t.cvv} />
                    </div>
                  )}
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/60 p-5">
                  <h4 className="text-lg font-bold">{t.orderItems}</h4>
                  <div className="mt-4 space-y-3">
                    {!cartItems.length ? <p className="text-sm text-slate-400">{t.emptyCart}</p> : cartItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.nameAr} className="h-12 w-12 rounded-xl object-contain bg-slate-950 p-1" />
                          <div><p className="font-semibold">{lang === "he" ? item.nameHe : item.nameAr}</p><p className="text-sm text-slate-400">{item.price}</p></div>
                        </div>
                        <button onClick={() => setCartItems((prev) => prev.filter((_, i) => i !== index))} className="rounded-xl border border-red-400/20 bg-red-400/10 p-2 text-red-200"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-slate-400">Total</span><span className="text-2xl font-black text-cyan-300">₪{cartTotal}</span></div>
                  <button onClick={handlePlaceOrder} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-400 px-5 py-3 font-bold text-slate-950">{t.placeOrder}</button>
                </div>
              </div>
            </section>
          )}

          {!isLoggedIn && (
            <section className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
              <div className="mb-5 flex items-center gap-3"><UserCog className="h-6 w-6 text-amber-300" /><div><h3 className="text-xl font-black md:text-2xl">{t.adminTitle}</h3><p className="text-sm text-slate-400">{t.adminSubtitle}</p></div></div>
              <form onSubmit={handleLogin} className="grid gap-3 md:grid-cols-3">
                <Field value={loginForm.username} onChange={(e) => setLoginForm((p) => ({ ...p, username: sanitizeText(e.target.value) }))} placeholder={t.username} />
                <Field type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} placeholder={t.password} />
                <button type="submit" disabled={isLoginBlocked} className="rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-60">{t.login}</button>
              </form>
              {loginError && <p className="mt-3 text-sm text-red-300">{loginError}</p>}
            </section>
          )}

          {isLoggedIn && isAdminOpen && (
            <section className="mt-8 space-y-6 rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-6 shadow-2xl shadow-black/20">
              <div><h3 className="text-2xl font-black">{t.adminTitle}</h3><p className="mt-2 text-slate-300">{t.adminSubtitle}</p></div>
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
                  <h4 className="mb-4 text-lg font-bold">{t.changeLoginTitle}</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field value={credentialForm.username} onChange={(e) => setCredentialForm((p) => ({ ...p, username: sanitizeText(e.target.value) }))} placeholder={t.username} />
                    <Field type="password" value={credentialForm.password} onChange={(e) => setCredentialForm((p) => ({ ...p, password: e.target.value }))} placeholder={t.password} />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-sm text-slate-400">{t.saveAccess}</p>
                    <button onClick={handleSaveCredentials} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950">Save</button>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
                  <h4 className="mb-4 text-lg font-bold">{t.addNewProduct}</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field value={newProduct.nameHe} onChange={(e) => setNewProduct((p) => ({ ...p, nameHe: sanitizeText(e.target.value) }))} placeholder={t.productNameHe} />
                    <Field value={newProduct.nameAr} onChange={(e) => setNewProduct((p) => ({ ...p, nameAr: sanitizeText(e.target.value) }))} placeholder={t.productNameAr} />
                    <Field as="select" value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}>{categories.filter((c) => c.key !== "all").map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</Field>
                    <Field value={newProduct.brand} onChange={(e) => setNewProduct((p) => ({ ...p, brand: sanitizeText(e.target.value) }))} placeholder={t.productBrand} />
                    <Field value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: sanitizeText(e.target.value) }))} placeholder={t.productPrice} />
                    <Field value={newProduct.oldPrice} onChange={(e) => setNewProduct((p) => ({ ...p, oldPrice: sanitizeText(e.target.value) }))} placeholder={t.productOldPrice} />
                    <Field value={newProduct.image} onChange={(e) => setNewProduct((p) => ({ ...p, image: sanitizeText(e.target.value) }))} placeholder={t.productImage} className="md:col-span-2" />
                    <label className="flex items-center gap-3 rounded-2xl border border-dashed border-cyan-400/30 bg-slate-950 px-4 py-3 text-sm text-cyan-200 md:col-span-2"><Upload className="h-4 w-4" />{t.uploadImage}<input type="file" accept="image/*" className="hidden" onChange={loadImage((image) => setNewProduct((p) => ({ ...p, image })))} /></label>
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 md:col-span-2"><input type="checkbox" checked={newProduct.featured} onChange={(e) => setNewProduct((p) => ({ ...p, featured: e.target.checked }))} /><span>{t.featured}</span></label>
                  </div>
                  <button onClick={handleAddProduct} className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-400 px-5 py-3 font-bold text-slate-950"><Plus className="me-2 inline h-4 w-4" />{t.addProduct}</button>
                </div>
              </div>

              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <Field value={product.nameHe} onChange={(e) => patchProduct(product.id, "nameHe", sanitizeText(e.target.value))} placeholder={t.productNameHe} />
                      <Field value={product.nameAr} onChange={(e) => patchProduct(product.id, "nameAr", sanitizeText(e.target.value))} placeholder={t.productNameAr} />
                      <Field value={product.brand} onChange={(e) => patchProduct(product.id, "brand", sanitizeText(e.target.value))} placeholder={t.productBrand} />
                      <Field as="select" value={product.category} onChange={(e) => patchProduct(product.id, "category", e.target.value)}>{categories.filter((c) => c.key !== "all").map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</Field>
                      <Field value={product.price} onChange={(e) => patchProduct(product.id, "price", sanitizeText(e.target.value))} placeholder={t.productPrice} />
                      <Field value={product.oldPrice || ""} onChange={(e) => patchProduct(product.id, "oldPrice", sanitizeText(e.target.value))} placeholder={t.productOldPrice} />
                      <Field value={product.image} onChange={(e) => patchProduct(product.id, "image", sanitizeText(e.target.value))} placeholder={t.productImage} className="xl:col-span-2" />
                      <label className="flex items-center gap-3 rounded-2xl border border-dashed border-cyan-400/30 bg-slate-950 px-4 py-3 text-sm text-cyan-200 xl:col-span-2"><Upload className="h-4 w-4" />{t.uploadImage}<input type="file" accept="image/*" className="hidden" onChange={loadImage((image) => patchProduct(product.id, "image", image))} /></label>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={product.featured} onChange={(e) => patchProduct(product.id, "featured", e.target.checked)} />{t.featured}</label>
                      <button onClick={() => setProducts((prev) => prev.filter((p) => p.id !== product.id))} className="rounded-2xl bg-red-500/90 px-4 py-2 font-bold text-white"><Trash2 className="me-2 inline h-4 w-4" />{t.delete}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section id="home" className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
            <div>
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">{t.heroBadge}</span>
              <h2 className="mt-6 text-4xl font-black leading-tight md:text-6xl">{t.heroTitle}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{t.heroText}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#products" className="rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-xl shadow-cyan-500/10">{t.primaryBtn}</a>
                <a href={WHATSAPP_URL} className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white"><MessageCircle className="me-2 inline h-4 w-4" />{t.secondaryBtn}</a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: `${products.length}+`, label: textByLang(lang, "منتج", "מוצרים") },
                  { value: `${averageRating}★`, label: textByLang(lang, "تقييم", "דירוג") },
                  { value: `${orders.length}+`, label: textByLang(lang, "طلبات", "הזמנות") },
                ].map((item) => <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><div className="text-2xl font-black md:text-3xl">{item.value}</div><div className="mt-1 text-sm text-slate-400">{item.label}</div></div>)}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl shadow-cyan-500/10">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                <img src="/smartlab-logo.png" alt="SmartLab" className="mx-auto h-28 w-auto object-contain md:h-36" />
                <div className="mt-6 rounded-[1.5rem] bg-gradient-to-r from-amber-300/15 to-cyan-400/15 p-4">
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div><p className="text-sm text-slate-400">{textByLang(lang, "العلامة", "מותג")}</p><p className="text-lg font-bold">SmartLab</p></div><Smartphone className="h-10 w-10 text-cyan-300" /></div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">{textByLang(lang, "بيع الأجهزة", "מכירת מכשירים")}</p><p className="mt-2 font-bold">Apple • Samsung • Xiaomi</p></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">{textByLang(lang, "خدمات المختبر", "שירותי מעבדה")}</p><p className="mt-2 font-bold">Screen • Battery • Software</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 py-6 md:grid-cols-3">
            {[
              { icon: Truck, title: textByLang(lang, "توصيل سريع", "משלוח מהיר"), desc: textByLang(lang, "تسليم سريع ومريح للعملاء في المنطقة.", "אספקה מהירה ונוחה ללקוחות באזור.") },
              { icon: CreditCard, title: textByLang(lang, "الدفع أونلاين", "תשלום אונליין"), desc: textByLang(lang, "واجهة طلب مباشر مع اختيار وسيلة الدفع.", "ממשק הזמנה ישיר עם בחירת אמצעי תשלום.") },
              { icon: PackageCheck, title: textByLang(lang, "تتبع الطلبات", "מעקב הזמנות"), desc: textByLang(lang, "فحص حالة الطلب بسرعة عبر كود الطلب.", "בדיקת סטטוס מהירה באמצעות קוד הזמנה.") },
            ].map((card) => {
              const Icon = card.icon;
              return <div key={card.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"><Icon className="mb-3 h-8 w-8 text-cyan-300" /><h3 className="text-lg font-bold">{card.title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{card.desc}</p></div>;
            })}
          </section>

          <section id="products" className="py-14">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div><h3 className="text-3xl font-black md:text-4xl">{t.productsTitle}</h3><p className="mt-2 text-slate-400">{t.productsSubtitle}</p></div>
              <div className="relative w-full md:max-w-md"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Field value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="bg-white/5 pl-11" /></div>
            </div>
            <div className="mb-6 flex flex-wrap gap-3">{categories.map((c) => <button key={c.key} onClick={() => setActiveCategory(c.key)} className={cn("rounded-2xl border px-4 py-2 text-sm font-semibold transition", activeCategory === c.key ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300")}>{c.label}</button>)}</div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-2xl shadow-black/20">
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6"><span className="absolute right-4 top-4 rounded-full bg-amber-300/90 px-3 py-1 text-xs font-bold text-slate-950">{lang === "he" ? product.badgeHe : product.badgeAr}</span><img src={product.image} alt={lang === "he" ? product.nameHe : product.nameAr} className="mx-auto h-40 w-auto object-contain transition duration-300 group-hover:scale-105" /></div>
                  <div className="mt-5"><p className="text-sm text-slate-400">{product.brand}</p><h4 className="mt-2 text-xl font-bold leading-8">{lang === "he" ? product.nameHe : product.nameAr}</h4><div className="mt-4 flex items-center gap-3"><span className="text-2xl font-black text-cyan-300">{product.price}</span>{product.oldPrice && <span className="text-sm text-slate-500 line-through">{product.oldPrice}</span>}</div><button onClick={() => addToCart(product)} className="mt-5 w-full rounded-2xl bg-white py-3 font-bold text-slate-950 transition hover:opacity-90"><ShoppingCart className="me-2 inline h-4 w-4" />{t.addToCart}</button></div>
                </div>
              ))}
            </div>
          </section>

          <section id="accessories" className="py-14">
            <div className="mb-6"><h3 className="text-3xl font-black md:text-4xl">{t.categoriesTitle}</h3><p className="mt-2 text-slate-400">{t.categoriesSubtitle}</p></div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{categoryCards.map((card) => { const Icon = card.icon; return <button key={card.key} onClick={() => setActiveCategory(card.key)} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-start transition hover:-translate-y-1"><Icon className="h-10 w-10 text-cyan-300" /><h4 className="mt-4 text-xl font-bold">{card.title}</h4><p className="mt-2 leading-7 text-slate-400">{card.desc}</p></button>; })}</div>
          </section>

          <section className="py-14">
            <div className="mb-6"><h3 className="text-3xl font-black md:text-4xl">{t.featuredTitle}</h3></div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{featuredProducts.map((product) => <div key={product.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"><img src={product.image} alt={lang === "he" ? product.nameHe : product.nameAr} className="mx-auto h-28 w-auto object-contain" /><h4 className="mt-4 text-lg font-bold">{lang === "he" ? product.nameHe : product.nameAr}</h4><div className="mt-3 font-extrabold text-cyan-300">{product.price}</div></div>)}</div>
          </section>

          <section className="py-14">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h3 className="text-3xl font-black md:text-4xl">{t.trackingTitle}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><Field value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} placeholder={t.trackingPlaceholder} /><button onClick={handleTrackOrder} className="rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-400 px-5 py-3 font-bold text-slate-950">{t.trackOrder}</button></div>
              {orderLookup && <div className="mt-5 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5"><p><strong>{t.orderCode}:</strong> {orderLookup.code}</p><p className="mt-2"><strong>{t.orderStatus}:</strong> {lang === "he" ? orderLookup.statusHe : orderLookup.statusAr}</p><p className="mt-2"><strong>Total:</strong> {orderLookup.total}</p></div>}
            </div>
          </section>

          <section className="py-14">
            <div className="mb-6"><h3 className="text-3xl font-black md:text-4xl">{t.reviewsTitle}</h3><p className="mt-2 text-slate-400">{averageRating} / 5</p></div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">{reviews.map((review) => <div key={review.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"><div className="flex items-center justify-between gap-3"><h4 className="font-bold">{review.name}</h4><div className="text-amber-300">{"★".repeat(review.rating)}</div></div><p className="mt-3 leading-7 text-slate-300">{lang === "he" ? review.commentHe : review.commentAr}</p></div>)}</div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <h4 className="text-xl font-bold">{t.addReview}</h4>
                <div className="mt-4 space-y-3">
                  <Field value={reviewForm.name} onChange={(e) => setReviewForm((p) => ({ ...p, name: sanitizeText(e.target.value) }))} placeholder={t.yourName} />
                  <Field as="select" value={reviewForm.rating} onChange={(e) => setReviewForm((p) => ({ ...p, rating: Number(e.target.value) }))}>{[5,4,3,2,1].map((r) => <option key={r} value={r}>{t.ratingLabel}: {r}</option>)}</Field>
                  <Field as="textarea" value={reviewForm.commentAr} onChange={(e) => setReviewForm((p) => ({ ...p, commentAr: sanitizeText(e.target.value) }))} placeholder={lang === "he" ? "תגובה בערבית" : "تعليق بالعربية"} className="min-h-[110px]" />
                  <Field as="textarea" value={reviewForm.commentHe} onChange={(e) => setReviewForm((p) => ({ ...p, commentHe: sanitizeText(e.target.value) }))} placeholder={lang === "he" ? "תגובה בעברית" : "تعليق بالعبرية"} className="min-h-[110px]" />
                  <button onClick={handleSubmitReview} className="w-full rounded-2xl bg-white px-5 py-3 font-bold text-slate-950">{t.submitReview}</button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-14"><div className="mb-6"><h3 className="text-3xl font-black md:text-4xl">{t.servicesTitle}</h3></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{serviceCards.map((card) => { const Icon = card.icon; return <div key={card.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"><Icon className="h-10 w-10 text-amber-300" /><h4 className="mt-4 text-xl font-bold">{card.title}</h4><p className="mt-2 leading-7 text-slate-400">{card.desc}</p></div>; })}</div></section>

          <section id="repair" className="grid gap-6 py-14 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-white/5 p-8"><Wrench className="h-10 w-10 text-cyan-300" /><h3 className="mt-5 text-3xl font-black">{t.repairTitle}</h3><p className="mt-4 max-w-xl leading-8 text-slate-300">{t.repairText}</p></div>
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-300/10 to-white/5 p-8"><MapPin className="h-10 w-10 text-amber-300" /><h3 className="mt-5 text-3xl font-black">{t.contactTitle}</h3><p className="mt-4 max-w-xl leading-8 text-slate-300">{t.contactText}</p><div className="mt-6 flex flex-wrap gap-4"><a href={WHATSAPP_URL} className="rounded-2xl bg-white px-6 py-3 font-bold text-slate-950">{t.whatsapp}</a><a href="#contact" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold">{t.location}</a></div></div>
          </section>
        </main>

        <footer id="contact" className="mt-10 border-t border-white/10 bg-slate-950/80">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
            <div><img src="/smartlab-logo.png" alt="SmartLab" className="h-10 w-auto object-contain" /><p className="mt-4 max-w-sm leading-7 text-slate-400">{textByLang(lang, "متجر هواتف وإكسسوارات ومختبر صيانة بتصميم احترافي وتجربة عصرية.", "חנות סלולר, אביזרים ומעבדה עם מראה מקצועי וחוויית לקוח מודרנית.")}</p></div>
            <div><h4 className="font-bold text-white">{t.contactTitle}</h4><div className="mt-4 space-y-3 text-slate-400"><p><Phone className="me-2 inline h-4 w-4" /> 0543347430</p><p><MessageCircle className="me-2 inline h-4 w-4" /> WhatsApp</p><p><MapPin className="me-2 inline h-4 w-4" /> {STORE_ADDRESS}</p></div></div>
            <div><h4 className="font-bold text-white">{t.links}</h4><div className="mt-4 space-y-3 text-slate-400">{t.nav.map((item) => <a key={item.key} href={`#${item.key}`} className="block transition hover:text-cyan-300">{item.label}</a>)}</div></div>
          </div>
          <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-500 md:px-8">© 2026 SmartLab. {t.footer}</div>
        </footer>
      </div>
    </div>
  );
}
