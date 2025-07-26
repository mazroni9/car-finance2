const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

const usedCars = [
    {
        make: 'تويوتا',
        model: 'كامري',
        year: 2014,
        price: 19500,
        color: 'فضي',
        mileage: 180000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-camry-2014.jpg']
    },
    {
        make: 'هونداي',
        model: 'سوناتا',
        year: 2013,
        price: 17800,
        color: 'أسود',
        mileage: 200000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-sonata-2013.jpg']
    },
    {
        make: 'نيسان',
        model: 'التيما',
        year: 2014,
        price: 18500,
        color: 'أبيض',
        mileage: 190000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-altima-2014.jpg']
    },
    {
        make: 'فورد',
        model: 'فيوجن',
        year: 2012,
        price: 15000,
        color: 'رمادي',
        mileage: 220000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-fusion-2012.jpg']
    },
    {
        make: 'كيا',
        model: 'اوبتيما',
        year: 2013,
        price: 16500,
        color: 'أزرق',
        mileage: 195000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-optima-2013.jpg']
    },
    {
        make: 'تويوتا',
        model: 'كورولا',
        year: 2014,
        price: 17000,
        color: 'أبيض',
        mileage: 175000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-corolla-2014.jpg']
    },
    {
        make: 'هونداي',
        model: 'النترا',
        year: 2012,
        price: 14500,
        color: 'أحمر',
        mileage: 210000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-elantra-2012.jpg']
    },
    {
        make: 'مازدا',
        model: '6',
        year: 2013,
        price: 16800,
        color: 'أسود',
        mileage: 185000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-mazda6-2013.jpg']
    },
    {
        make: 'شيفروليه',
        model: 'ماليبو',
        year: 2014,
        price: 18000,
        color: 'فضي',
        mileage: 170000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-malibu-2014.jpg']
    },
    {
        make: 'كرايسلر',
        model: '300',
        year: 2011,
        price: 20000,
        color: 'أسود',
        mileage: 230000,
        fuel_type: 'بنزين',
        transmission: 'أوتوماتيك',
        status: 'available',
        seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
        images: ['https://res.cloudinary.com/demo/image/upload/used-chrysler300-2011.jpg']
    }
];

async function addUsedCars() {
    try {
        // إضافة السيارات
        const { data: cars, error: carsError } = await supabase
            .from('car_showcase')
            .insert(usedCars)
            .select();

        if (carsError) throw carsError;

        console.log('✅ تم إضافة السيارات بنجاح:', cars.length);

        // إضافة سجل المعاملة
        const { error: transactionError } = await supabase
            .from('showroom_transactions')
            .insert({
                showroom_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
                type: 'inventory_update',
                amount: 0,
                description: 'تم إضافة 10 سيارات مستعملة للمخزون',
                status: 'completed'
            });

        if (transactionError) throw transactionError;

        console.log('✅ تم تسجيل المعاملة بنجاح');

    } catch (error) {
        console.error('❌ حدث خطأ:', error);
    }
}

addUsedCars(); 