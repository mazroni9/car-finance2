const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCarImages() {
    try {
        console.log('🔧 جاري إصلاح روابط الصور...');

        // تحديث سيارات هيونداي سوناتا
        const { error: sonataError } = await supabase
            .from('car_showcase')
            .update({
                image_url: 'https://res.cloudinary.com/demo/image/upload/sonata-2022.jpg',
                images: ['https://res.cloudinary.com/demo/image/upload/sonata-2022-1.jpg', 'https://res.cloudinary.com/demo/image/upload/sonata-2022-2.jpg']
            })
            .eq('make', 'هيونداي')
            .eq('model', 'سوناتا');

        if (sonataError) {
            console.error('❌ خطأ في تحديث سوناتا:', sonataError);
        } else {
            console.log('✅ تم تحديث صور سوناتا');
        }

        // تحديث سيارات هوندا أكورد
        const { error: accordError } = await supabase
            .from('car_showcase')
            .update({
                image_url: 'https://res.cloudinary.com/demo/image/upload/accord-2023.jpg',
                images: ['https://res.cloudinary.com/demo/image/upload/accord-2023-1.jpg', 'https://res.cloudinary.com/demo/image/upload/accord-2023-2.jpg']
            })
            .eq('make', 'هوندا')
            .eq('model', 'أكورد');

        if (accordError) {
            console.error('❌ خطأ في تحديث أكورد:', accordError);
        } else {
            console.log('✅ تم تحديث صور أكورد');
        }

        console.log('✅ تم إصلاح جميع روابط الصور بنجاح');

    } catch (error) {
        console.error('❌ حدث خطأ:', error);
    }
}

fixCarImages(); 