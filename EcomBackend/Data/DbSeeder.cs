using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication2.Models;

namespace WebApplication2.Data
{
    public static class DbSeeder
    {
        public static void SeedProducts(AppDbContext context)
        {
            if (context.Products.Any())
            {
                return; // Database has already been seeded
            }

            var products = new List<Product>
            {
                // 1
                new Product
                {
                    Id = "1",
                    Name = "Sony WH-1000XM5 Wireless Headphones",
                    Brand = "Sony",
                    Category = "electronics",
                    Subcategory = "Audio",
                    Price = 24999,
                    StockQuantity = 45,
                    Badge = "Best Seller",
                    Rating = 4.8,
                    ReviewCount = 2341,
                    Description = "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Integrated Processor V1. Up to 30-hour battery life with quick charge.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80\",\"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80\",\"https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80\"]",
                    SpecificationsJson = "{\"Driver Unit\":\"30 mm\",\"Frequency Response\":\"4 Hz – 40,000 Hz\",\"Battery Life\":\"30 hours (NC ON)\",\"Charging Time\":\"3.5 hours\",\"Weight\":\"250 g\",\"Connectivity\":\"Bluetooth 5.2\",\"Color\":\"Black\"}",
                    FeaturesJson = "[\"Active Noise Cancellation\",\"Multipoint Connection\",\"Speak-to-Chat\",\"LDAC Support\"]",
                    TagsJson = "[\"headphones\",\"wireless\",\"noise-canceling\",\"sony\"]",
                    FreeShipping = true,
                    Trending = true,
                    Featured = true
                },
                // 2
                new Product
                {
                    Id = "2",
                    Name = "Apple iPhone 15 Pro Max 256GB",
                    Brand = "Apple",
                    Category = "electronics",
                    Subcategory = "Smartphones",
                    Price = 134999,
                    StockQuantity = 12,
                    Badge = "Hot",
                    Rating = 4.9,
                    ReviewCount = 8932,
                    Description = "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80\",\"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80\",\"https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80\"]",
                    SpecificationsJson = "{\"Chip\":\"A17 Pro\",\"Display\":\"6.7\\\" Super Retina XDR OLED\",\"Camera\":\"48MP Main | 12MP Ultra Wide | 12MP 5x Telephoto\",\"Storage\":\"256GB\",\"Battery\":\"Up to 29 hours video playback\",\"OS\":\"iOS 17\",\"Color\":\"Natural Titanium\"}",
                    FeaturesJson = "[\"USB 3 Speed\",\"Action Button\",\"Dynamic Island\",\"ProMotion 120Hz\"]",
                    TagsJson = "[\"iphone\",\"apple\",\"smartphone\",\"5g\"]",
                    FreeShipping = true,
                    Trending = true,
                    Featured = true
                },
                // 3
                new Product
                {
                    Id = "3",
                    Name = "Samsung Galaxy S24 Ultra 512GB",
                    Brand = "Samsung",
                    Category = "electronics",
                    Subcategory = "Smartphones",
                    Price = 129999,
                    StockQuantity = 28,
                    Badge = "Trending",
                    Rating = 4.7,
                    ReviewCount = 4521,
                    Description = "The Galaxy S24 Ultra brings revolutionary AI features with Galaxy AI, built-in S Pen, and a 200MP camera system.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80\",\"https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80\"]",
                    SpecificationsJson = "{\"Processor\":\"Snapdragon 8 Gen 3\",\"Display\":\"6.8\\\" Dynamic AMOLED 2X 120Hz\",\"Camera\":\"200MP + 50MP + 12MP + 10MP\",\"Storage\":\"512GB\",\"RAM\":\"12GB\",\"Battery\":\"5000 mAh\"}",
                    FeaturesJson = "[\"Galaxy AI\",\"Built-in S Pen\",\"100x Space Zoom\",\"Titanium Frame\"]",
                    TagsJson = "[\"samsung\",\"galaxy\",\"android\",\"s-pen\"]",
                    FreeShipping = true,
                    Trending = true,
                    Featured = true
                },
                // 4
                new Product
                {
                    Id = "4",
                    Name = "MacBook Air M3 15\" Laptop",
                    Brand = "Apple",
                    Category = "electronics",
                    Subcategory = "Laptops",
                    Price = 134900,
                    StockQuantity = 20,
                    Badge = "New",
                    Rating = 4.9,
                    ReviewCount = 3210,
                    Description = "The new MacBook Air 15\" with the blazing-fast M3 chip. Incredible performance, all-day battery life, and a stunning Liquid Retina display.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80\",\"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80\"]",
                    SpecificationsJson = "{\"Chip\":\"Apple M3\",\"Memory\":\"8GB Unified Memory\",\"Storage\":\"256GB SSD\",\"Display\":\"15.3\\\" Liquid Retina\",\"Battery\":\"Up to 18 hours\",\"Weight\":\"1.51 kg\"}",
                    FeaturesJson = "[\"Fanless Design\",\"MagSafe Charging\",\"Wi-Fi 6E\",\"Touch ID\"]",
                    TagsJson = "[\"macbook\",\"apple\",\"laptop\",\"m3\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = true
                },
                // 5
                new Product
                {
                    Id = "5",
                    Name = "Apple Watch Series 9 GPS 45mm",
                    Brand = "Apple",
                    Category = "electronics",
                    Subcategory = "Wearables",
                    Price = 41900,
                    StockQuantity = 34,
                    Badge = "",
                    Rating = 4.8,
                    ReviewCount = 1872,
                    Description = "Apple Watch Series 9 is a carbon neutral product with the powerful S9 SiP chip, Double Tap gesture, and a brighter always-on display.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80\",\"https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&q=80\"]",
                    SpecificationsJson = "{\"Chip\":\"S9 SiP\",\"Display\":\"45mm Always-On Retina LTPO OLED\",\"Battery\":\"Up to 18 hours\",\"GPS\":\"Precision GPS\",\"Water Resistant\":\"50 meters\"}",
                    FeaturesJson = "[\"Double Tap\",\"Crash Detection\",\"ECG App\",\"Blood Oxygen\"]",
                    TagsJson = "[\"apple watch\",\"smartwatch\",\"fitness tracker\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 6
                new Product
                {
                    Id = "6",
                    Name = "Sony PlayStation 5 Console",
                    Brand = "Sony",
                    Category = "electronics",
                    Subcategory = "Gaming",
                    Price = 49990,
                    StockQuantity = 5,
                    Badge = "Hot",
                    Rating = 4.9,
                    ReviewCount = 9871,
                    Description = "The PlayStation 5 console unleashes new gaming possibilities with ultra-high speed SSD, DualSense wireless controller, and 4K gaming.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1607853202273-232359f6f299?w=600&q=80\",\"https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80\"]",
                    SpecificationsJson = "{\"CPU\":\"AMD Zen 2 8-Core 3.5GHz\",\"GPU\":\"AMD RDNA 2 10.28 TFLOPS\",\"Storage\":\"825GB NVMe SSD\",\"RAM\":\"16GB GDDR6\",\"Optical Drive\":\"Ultra HD Blu-ray\"}",
                    FeaturesJson = "[\"4K Gaming\",\"Ray Tracing\",\"Haptic Feedback\",\"3D Audio\"]",
                    TagsJson = "[\"ps5\",\"playstation\",\"gaming\",\"console\"]",
                    FreeShipping = true,
                    Trending = true,
                    Featured = true
                },
                // 7
                new Product
                {
                    Id = "7",
                    Name = "Dell XPS 15 Laptop i7 13th Gen",
                    Brand = "Dell",
                    Category = "electronics",
                    Subcategory = "Laptops",
                    Price = 119990,
                    StockQuantity = 15,
                    Badge = "",
                    Rating = 4.6,
                    ReviewCount = 987,
                    Description = "The Dell XPS 15 offers a stunning 15.6\" OLED display, 13th Gen Intel Core i7, and professional-grade performance in a sleek chassis.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80\",\"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80\"]",
                    SpecificationsJson = "{\"Processor\":\"Intel Core i7-13700H\",\"RAM\":\"16GB DDR5\",\"Storage\":\"512GB SSD\",\"Display\":\"15.6\\\" OLED 3.5K 60Hz\",\"GPU\":\"NVIDIA RTX 4060\"}",
                    FeaturesJson = "[\"OLED Display\",\"Thunderbolt 4\",\"Fingerprint Reader\",\"Wi-Fi 6E\"]",
                    TagsJson = "[\"dell\",\"xps\",\"laptop\",\"gaming\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 8
                new Product
                {
                    Id = "8",
                    Name = "JBL Flip 6 Portable Bluetooth Speaker",
                    Brand = "JBL",
                    Category = "electronics",
                    Subcategory = "Audio",
                    Price = 8999,
                    StockQuantity = 80,
                    Badge = "Sale",
                    Rating = 4.5,
                    ReviewCount = 3421,
                    Description = "Powerful sound with JBL Pro Sound, IP67 waterproof and dustproof, 12 hours of playtime, and a PartyBoost feature.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80\",\"https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80\"]",
                    SpecificationsJson = "{\"Output Power\":\"30W\",\"Battery Life\":\"12 hours\",\"Waterproof\":\"IP67\",\"Connectivity\":\"Bluetooth 5.1\",\"Weight\":\"565 g\"}",
                    FeaturesJson = "[\"IP67 Waterproof\",\"PartyBoost\",\"JBL Portable App\",\"USB-C Charging\"]",
                    TagsJson = "[\"jbl\",\"speaker\",\"bluetooth\",\"portable\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 9
                new Product
                {
                    Id = "9",
                    Name = "Nike Air Max 270 Running Shoes",
                    Brand = "Nike",
                    Category = "fashion",
                    Subcategory = "Footwear",
                    Price = 8995,
                    StockQuantity = 60,
                    Badge = "Best Seller",
                    Rating = 4.7,
                    ReviewCount = 5621,
                    Description = "The Nike Air Max 270 delivers an exceptionally smooth ride with the largest heel Air unit yet for all-day comfort.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80\",\"https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80\"]",
                    SpecificationsJson = "{\"Type\":\"Lifestyle/Running\",\"Upper\":\"Mesh & synthetic\",\"Sole\":\"Rubber\",\"Closure\":\"Lace-up\",\"Available Sizes\":\"6-12\"}",
                    FeaturesJson = "[\"Air Max 270 cushioning\",\"Breathable mesh upper\",\"Foam midsole\",\"Rubber outsole\"]",
                    TagsJson = "[\"nike\",\"shoes\",\"air max\",\"running\"]",
                    FreeShipping = false,
                    Trending = true,
                    Featured = true
                },
                // 10
                new Product
                {
                    Id = "10",
                    Name = "Levi's 511 Slim Fit Jeans",
                    Brand = "Levi's",
                    Category = "fashion",
                    Subcategory = "Clothing",
                    Price = 2499,
                    StockQuantity = 120,
                    Badge = "Sale",
                    Rating = 4.4,
                    ReviewCount = 4231,
                    Description = "The iconic Levi's 511 slim fit jeans offer a sleek, modern silhouette that sits at the waist and tapers below the knee.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80\",\"https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80\"]",
                    SpecificationsJson = "{\"Fit\":\"Slim\",\"Rise\":\"Regular\",\"Material\":\"99% Cotton, 1% Elastane\",\"Closure\":\"Zip fly with button\",\"Sizes\":\"28-38\"}",
                    FeaturesJson = "[\"Slim fit\",\"Stretch fabric\",\"Classic 5-pocket style\",\"Machine washable\"]",
                    TagsJson = "[\"levi's\",\"jeans\",\"denim\",\"slim fit\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 11
                new Product
                {
                    Id = "11",
                    Name = "Adidas Ultraboost 22 Shoes",
                    Brand = "Adidas",
                    Category = "fashion",
                    Subcategory = "Footwear",
                    Price = 14999,
                    StockQuantity = 45,
                    Badge = "",
                    Rating = 4.8,
                    ReviewCount = 2890,
                    Description = "Adidas Ultraboost 22 features Boost midsole energy return and a Primeknit+ upper for the ultimate running experience.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80\",\"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80\"]",
                    SpecificationsJson = "{\"Type\":\"Running\",\"Midsole\":\"Boost\",\"Upper\":\"Primeknit+\",\"Drop\":\"10 mm\",\"Weight\":\"310 g\"}",
                    FeaturesJson = "[\"Boost Midsole\",\"Primeknit+ Upper\",\"Continental Rubber Outsole\",\"Linear Energy Push\"]",
                    TagsJson = "[\"adidas\",\"ultraboost\",\"running\",\"shoes\"]",
                    FreeShipping = true,
                    Trending = true,
                    Featured = false
                },
                // 12
                new Product
                {
                    Id = "12",
                    Name = "Ray-Ban Aviator Classic Sunglasses",
                    Brand = "Ray-Ban",
                    Category = "fashion",
                    Subcategory = "Accessories",
                    Price = 7990,
                    StockQuantity = 90,
                    Badge = "",
                    Rating = 4.7,
                    ReviewCount = 1523,
                    Description = "The Ray-Ban Aviator Classic is the original style that defined eyewear fashion. Featuring iconic teardrop-shaped lenses and a sleek metal frame.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80\",\"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80\"]",
                    SpecificationsJson = "{\"Frame Material\":\"Metal\",\"Lens Material\":\"Crystal\",\"UV Protection\":\"100% UV400\",\"Frame Width\":\"58 mm\"}",
                    FeaturesJson = "[\"100% UV Protection\",\"Classic Metal Frame\",\"Crystal Lenses\",\"Adjustable Nose Pads\"]",
                    TagsJson = "[\"ray-ban\",\"sunglasses\",\"aviator\",\"accessories\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 13
                new Product
                {
                    Id = "13",
                    Name = "Dyson V15 Detect Vacuum Cleaner",
                    Brand = "Dyson",
                    Category = "home",
                    Subcategory = "Appliances",
                    Price = 62900,
                    StockQuantity = 22,
                    Badge = "Premium",
                    Rating = 4.8,
                    ReviewCount = 1234,
                    Description = "The Dyson V15 Detect uses laser technology to reveal microscopic dust invisible to the naked eye and an acoustic piezo sensor to count and size particles.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80\",\"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80\"]",
                    SpecificationsJson = "{\"Suction Power\":\"230 AW\",\"Battery Life\":\"60 minutes\",\"Filtration\":\"HEPA\",\"Weight\":\"3.1 kg\"}",
                    FeaturesJson = "[\"Laser Dust Detection\",\"HEPA Filtration\",\"LCD Screen\",\"60-min Runtime\"]",
                    TagsJson = "[\"dyson\",\"vacuum\",\"cleaner\",\"home\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = true
                },
                // 14
                new Product
                {
                    Id = "14",
                    Name = "Instant Pot Duo 7-in-1 Pressure Cooker",
                    Brand = "Instant Pot",
                    Category = "home",
                    Subcategory = "Kitchen",
                    Price = 7999,
                    StockQuantity = 55,
                    Badge = "Best Seller",
                    Rating = 4.6,
                    ReviewCount = 6789,
                    Description = "7-in-1 appliance: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and food warmer in one.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80\",\"https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80\"]",
                    SpecificationsJson = "{\"Capacity\":\"6 Quart\",\"Modes\":\"7\",\"Programs\":\"14 Smart Programs\",\"Power\":\"1000W\"}",
                    FeaturesJson = "[\"7-in-1 Functionality\",\"14 Smart Programs\",\"Delay Start\",\"3 Temperatures\"]",
                    TagsJson = "[\"instant pot\",\"pressure cooker\",\"kitchen\",\"cooking\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 15
                new Product
                {
                    Id = "15",
                    Name = "Philips Hue Starter Kit Smart Lights",
                    Brand = "Philips",
                    Category = "home",
                    Subcategory = "Smart Home",
                    Price = 12999,
                    StockQuantity = 40,
                    Badge = "",
                    Rating = 4.5,
                    ReviewCount = 890,
                    Description = "Transform your home with Philips Hue smart lighting. 16 million colors, voice control, and energy-saving LED technology.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80\"]",
                    SpecificationsJson = "{\"Bulbs\":\"3x 9W E27\",\"Colors\":\"16 million\",\"Control\":\"App, Voice, Motion\",\"Connectivity\":\"Zigbee, Bluetooth\"}",
                    FeaturesJson = "[\"16M Colors\",\"Voice Control\",\"App Control\",\"Energy Efficient\"]",
                    TagsJson = "[\"philips\",\"smart lights\",\"home automation\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 16
                new Product
                {
                    Id = "16",
                    Name = "Fitbit Charge 6 Fitness Tracker",
                    Brand = "Fitbit",
                    Category = "sports",
                    Subcategory = "Wearables",
                    Price = 13999,
                    StockQuantity = 65,
                    Badge = "",
                    Rating = 4.4,
                    ReviewCount = 2341,
                    Description = "Fitbit Charge 6 with Google Maps and Wallet integration. Track your health 24/7 with heart rate, SpO2, stress management score.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80\",\"https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&q=80\"]",
                    SpecificationsJson = "{\"Battery Life\":\"7 days\",\"Water Resistant\":\"50 meters\",\"Sensors\":\"Heart Rate, SpO2, EDA, ECG\",\"Connectivity\":\"Bluetooth, Wi-Fi, NFC\"}",
                    FeaturesJson = "[\"Google Maps\",\"Google Wallet\",\"Built-in GPS\",\"ECG App\"]",
                    TagsJson = "[\"fitbit\",\"fitness tracker\",\"health\",\"wearable\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 17
                new Product
                {
                    Id = "17",
                    Name = "Yoga Mat Premium Non-Slip 6mm",
                    Brand = "Lululemon",
                    Category = "sports",
                    Subcategory = "Yoga & Fitness",
                    Price = 3499,
                    StockQuantity = 100,
                    Badge = "Sale",
                    Rating = 4.7,
                    ReviewCount = 1567,
                    Description = "Premium 6mm non-slip yoga mat made from eco-friendly TPE material. Double-sided texture for all yoga styles.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80\",\"https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80\"]",
                    SpecificationsJson = "{\"Thickness\":\"6mm\",\"Material\":\"Eco-friendly TPE\",\"Dimensions\":\"183cm x 61cm\",\"Weight\":\"1.2 kg\"}",
                    FeaturesJson = "[\"Non-Slip Surface\",\"Eco-Friendly\",\"Carrying Strap Included\",\"Sweat Resistant\"]",
                    TagsJson = "[\"yoga\",\"mat\",\"fitness\",\"exercise\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 18
                new Product
                {
                    Id = "18",
                    Name = "Bowflex 552 Adjustable Dumbbells (Pair)",
                    Brand = "Bowflex",
                    Category = "sports",
                    Subcategory = "Gym Equipment",
                    Price = 24999,
                    StockQuantity = 18,
                    Badge = "Premium",
                    Rating = 4.9,
                    ReviewCount = 3421,
                    Description = "Adjustable dumbbells replace 30 sets of weights. Quick and easy weight change with a single turn of the dial.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80\",\"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80\"]",
                    SpecificationsJson = "{\"Weight Range\":\"2.3 - 24 kg each\",\"Increments\":\"15 settings\",\"Dimensions\":\"40cm x 20cm\",\"Material\":\"Alloy Steel\"}",
                    FeaturesJson = "[\"15 Weight Settings\",\"Space-Saving\",\"Quick-Change Mechanism\",\"Durable Construction\"]",
                    TagsJson = "[\"dumbbells\",\"weights\",\"gym\",\"fitness\"]",
                    FreeShipping = true,
                    Trending = true,
                    Featured = true
                },
                // 19
                new Product
                {
                    Id = "19",
                    Name = "Dyson Airwrap Multi-Styler",
                    Brand = "Dyson",
                    Category = "beauty",
                    Subcategory = "Hair Care",
                    Price = 44900,
                    StockQuantity = 25,
                    Badge = "Luxury",
                    Rating = 4.8,
                    ReviewCount = 4321,
                    Description = "The Dyson Airwrap multi-styler uses air to curl, wave, smooth, and dry your hair for a professional finish at home.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80\"]",
                    SpecificationsJson = "{\"Wattage\":\"1300W\",\"Heat Settings\":\"3\",\"Attachments\":\"6\",\"Cord Length\":\"2.7m\"}",
                    FeaturesJson = "[\"No Extreme Heat\",\"Multiple Attachments\",\"Frizz Control\",\"Coanda Effect\"]",
                    TagsJson = "[\"dyson\",\"hair styler\",\"beauty\",\"hair care\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = true
                },
                // 20
                new Product
                {
                    Id = "20",
                    Name = "The Ordinary Skincare Bundle",
                    Brand = "The Ordinary",
                    Category = "beauty",
                    Subcategory = "Skincare",
                    Price = 1999,
                    StockQuantity = 200,
                    Badge = "Sale",
                    Rating = 4.5,
                    ReviewCount = 7821,
                    Description = "A complete skincare routine bundle with hyaluronic acid serum, niacinamide 10% + zinc 1%, and AHA + BHA peel.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80\",\"https://images.unsplash.com/photo-1570194065650-d99fb4ee0f8e?w=600&q=80\"]",
                    SpecificationsJson = "{\"Set Includes\":\"3 products\",\"Skin Type\":\"All skin types\",\"Size\":\"30ml each\"}",
                    FeaturesJson = "[\"Vegan Formula\",\"Dermatologist Tested\",\"Cruelty Free\",\"Fragrance Free\"]",
                    TagsJson = "[\"skincare\",\"beauty\",\"serum\",\"the ordinary\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 21
                new Product
                {
                    Id = "21",
                    Name = "Atomic Habits — James Clear",
                    Brand = "Random House",
                    Category = "books",
                    Subcategory = "Self-Help",
                    Price = 499,
                    StockQuantity = 500,
                    Badge = "Best Seller",
                    Rating = 4.9,
                    ReviewCount = 45678,
                    Description = "The life-changing million-copy #1 bestseller. An easy and proven way to build good habits and break bad ones.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80\",\"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80\"]",
                    SpecificationsJson = "{\"Author\":\"James Clear\",\"Pages\":\"320\",\"Language\":\"English\",\"Publisher\":\"Random House\",\"Edition\":\"Paperback\"}",
                    FeaturesJson = "[\"Practical Framework\",\"Scientific Approach\",\"Actionable Strategies\",\"International Bestseller\"]",
                    TagsJson = "[\"book\",\"self-help\",\"habits\",\"productivity\"]",
                    FreeShipping = false,
                    Trending = true,
                    Featured = false
                },
                // 22
                new Product
                {
                    Id = "22",
                    Name = "Whey Protein Isolate 2kg",
                    Brand = "MuscleBlaze",
                    Category = "health",
                    Subcategory = "Nutrition",
                    Price = 3799,
                    StockQuantity = 150,
                    Badge = "Best Seller",
                    Rating = 4.5,
                    ReviewCount = 12432,
                    Description = "MuscleBlaze Whey Protein Isolate with 28g protein per serving, low carbs and fats, and superior digestibility.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80\",\"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80\"]",
                    SpecificationsJson = "{\"Protein per Serving\":\"28g\",\"Servings\":\"66 (per 2kg)\",\"Flavor\":\"Chocolate\",\"Weight\":\"2 kg\",\"Type\":\"Whey Protein Isolate\"}",
                    FeaturesJson = "[\"28g Protein\",\"Low Sugar\",\"Easy Mixing\",\"FSSAI Certified\"]",
                    TagsJson = "[\"protein\",\"whey\",\"supplement\",\"gym\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 23
                new Product
                {
                    Id = "23",
                    Name = "Kindle Paperwhite 11th Gen",
                    Brand = "Amazon",
                    Category = "electronics",
                    Subcategory = "E-Readers",
                    Price = 13999,
                    StockQuantity = 55,
                    Badge = "",
                    Rating = 4.7,
                    ReviewCount = 8921,
                    Description = "Kindle Paperwhite with 6.8\" display, adjustable warm light, up to 10 weeks battery, and IPX8 waterproof.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&q=80\"]",
                    SpecificationsJson = "{\"Display\":\"6.8\\\" Paperwhite Display\",\"Resolution\":\"300 ppi\",\"Storage\":\"8GB\",\"Battery\":\"Up to 10 weeks\",\"Waterproof\":\"IPX8\"}",
                    FeaturesJson = "[\"300ppi Display\",\"Adjustable Warm Light\",\"Waterproof\",\"10 Week Battery\"]",
                    TagsJson = "[\"kindle\",\"e-reader\",\"books\",\"amazon\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 24
                new Product
                {
                    Id = "24",
                    Name = "DJI Mini 3 Pro Drone",
                    Brand = "DJI",
                    Category = "electronics",
                    Subcategory = "Drones",
                    Price = 79000,
                    StockQuantity = 10,
                    Badge = "Premium",
                    Rating = 4.8,
                    ReviewCount = 1234,
                    Description = "DJI Mini 3 Pro weighs less than 249g with a 1/1.3-inch CMOS sensor, 4K/60fps video, and tri-directional obstacle sensing.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&q=80\",\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80\"]",
                    SpecificationsJson = "{\"Weight\":\"249 g\",\"Camera\":\"1/1.3\\\" CMOS 48MP\",\"Video\":\"4K/60fps\",\"Flight Time\":\"34 minutes\",\"Range\":\"12 km\"}",
                    FeaturesJson = "[\"4K/60fps\",\"Obstacle Sensing\",\"Return to Home\",\"ActiveTrack 360°\"]",
                    TagsJson = "[\"dji\",\"drone\",\"camera\",\"photography\"]",
                    FreeShipping = true,
                    Trending = true,
                    Featured = true
                },
                // 25
                new Product
                {
                    Id = "25",
                    Name = "Puma Sneakers Running Shoes",
                    Brand = "Puma",
                    Category = "fashion",
                    Subcategory = "Footwear",
                    Price = 4999,
                    StockQuantity = 75,
                    Badge = "",
                    Rating = 4.3,
                    ReviewCount = 2134,
                    Description = "PUMA running shoes with SoftFoam+ midsole for step-in comfort, rubber outsole for reliable traction.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80\"]",
                    SpecificationsJson = "{\"Upper\":\"Mesh\",\"Midsole\":\"SoftFoam+\",\"Outsole\":\"Rubber\",\"Closure\":\"Lace-up\"}",
                    FeaturesJson = "[\"SoftFoam+ Cushioning\",\"Mesh Upper\",\"Rubber Outsole\",\"Lightweight\"]",
                    TagsJson = "[\"puma\",\"sneakers\",\"shoes\",\"running\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 26
                new Product
                {
                    Id = "26",
                    Name = "Instant Camera Fujifilm Instax Mini 12",
                    Brand = "Fujifilm",
                    Category = "electronics",
                    Subcategory = "Cameras",
                    Price = 7499,
                    StockQuantity = 48,
                    Badge = "New",
                    Rating = 4.6,
                    ReviewCount = 3421,
                    Description = "Fujifilm Instax Mini 12 captures moments and prints them instantly. Features auto exposure and built-in selfie mirror.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&q=80\"]",
                    SpecificationsJson = "{\"Film\":\"Instax Mini\",\"Shutter Speed\":\"1/2 – 1/250 sec\",\"Flash\":\"Auto\",\"Size\":\"107 x 121 x 67 mm\"}",
                    FeaturesJson = "[\"Auto Exposure\",\"Selfie Mirror\",\"Parallelogram Finder\",\"Easy Operation\"]",
                    TagsJson = "[\"fujifilm\",\"instax\",\"camera\",\"photography\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 27
                new Product
                {
                    Id = "27",
                    Name = "boAt Rockerz 450 Bluetooth Headphones",
                    Brand = "boAt",
                    Category = "electronics",
                    Subcategory = "Audio",
                    Price = 1299,
                    StockQuantity = 200,
                    Badge = "Sale",
                    Rating = 4.2,
                    ReviewCount = 89432,
                    Description = "boAt Rockerz 450 with 40mm drivers, 15-hour playback, and padded ear cushions for premium comfort.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80\"]",
                    SpecificationsJson = "{\"Driver Size\":\"40mm\",\"Battery\":\"400mAh\",\"Playback Time\":\"15 hours\",\"Connectivity\":\"Bluetooth 5.0 + 3.5mm\"}",
                    FeaturesJson = "[\"15-Hour Playback\",\"Foldable Design\",\"Voice Assistant\",\"Padded Cushions\"]",
                    TagsJson = "[\"boat\",\"headphones\",\"bluetooth\",\"budget\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 28
                new Product
                {
                    Id = "28",
                    Name = "Mi Smart Band 8 Fitness Tracker",
                    Brand = "Xiaomi",
                    Category = "electronics",
                    Subcategory = "Wearables",
                    Price = 2799,
                    StockQuantity = 150,
                    Badge = "",
                    Rating = 4.4,
                    ReviewCount = 34521,
                    Description = "Mi Smart Band 8 features a 1.62\" AMOLED display, 16-day battery life, and 150+ workout modes.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80\"]",
                    SpecificationsJson = "{\"Display\":\"1.62\\\" AMOLED\",\"Battery Life\":\"16 days\",\"Workout Modes\":\"150+\",\"Water Resistant\":\"50m\"}",
                    FeaturesJson = "[\"AMOLED Display\",\"150+ Workouts\",\"16-Day Battery\",\"Sleep Tracking\"]",
                    TagsJson = "[\"xiaomi\",\"mi band\",\"fitness\",\"smart band\"]",
                    FreeShipping = false,
                    Trending = false,
                    Featured = false
                },
                // 29
                new Product
                {
                    Id = "29",
                    Name = "Coffee Table - Scandinavian Oak",
                    Brand = "IKEA",
                    Category = "home",
                    Subcategory = "Furniture",
                    Price = 12999,
                    StockQuantity = 30,
                    Badge = "",
                    Rating = 4.6,
                    ReviewCount = 892,
                    Description = "Scandinavian-inspired solid oak coffee table with clean lines and sturdy construction. Perfect for modern living rooms.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80\"]",
                    SpecificationsJson = "{\"Material\":\"Solid Oak\",\"Dimensions\":\"120 x 60 x 45 cm\",\"Weight\":\"18 kg\",\"Assembly\":\"Required\"}",
                    FeaturesJson = "[\"Solid Wood\",\"Easy Assembly\",\"Scratch Resistant\",\"Modern Design\"]",
                    TagsJson = "[\"furniture\",\"coffee table\",\"ikea\",\"living room\"]",
                    FreeShipping = true,
                    Trending = false,
                    Featured = false
                },
                // 30
                new Product
                {
                    Id = "30",
                    Name = "Noise Cancelling Earbuds Pro",
                    Brand = "Nothing",
                    Category = "electronics",
                    Subcategory = "Audio",
                    Price = 8999,
                    StockQuantity = 60,
                    Badge = "New",
                    Rating = 4.5,
                    ReviewCount = 2341,
                    Description = "Nothing Ear (2) with Active Noise Cancellation up to 45dB, personalized sound, and 36-hour total battery life.",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80\"]",
                    SpecificationsJson = "{\"ANC\":\"Up to 45dB\",\"Battery (Earbuds)\":\"6.3 hours\",\"Battery (Case)\":\"36 hours total\",\"Connectivity\":\"Bluetooth 5.3\"}",
                    FeaturesJson = "[\"45dB ANC\",\"Transparency Mode\",\"Wireless Charging\",\"IP54 Rated\"]",
                    TagsJson = "[\"nothing\",\"earbuds\",\"anc\",\"wireless\"]",
                    FreeShipping = false,
                    Trending = true,
                    Featured = false
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
