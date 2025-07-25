"use client";
import Marquee from "react-fast-marquee";

export default function NewsMarquee() {
  return (
    <div className="w-full overflow-hidden">
      <Marquee
        direction="right"
        speed={25}
        gradient={false}
        className="bg-blue-900 text-white font-bold text-lg py-2"
        loop={true}
        autoFill={true}
        play={true}
        delay={0}
      >
        لماذا تستثمر معنا؟ ✔️ تمويل شرعي
        <span style={{ display: "inline-block", width: 80 }}></span>
        طرق تمويل متنوعة
        <span style={{ display: "inline-block", width: 80 }}></span>
        أرباح دورية تصلك بانتظام
        <span style={{ display: "inline-block", width: 80 }}></span>
        التخارج متاح بعد سنتين أو خمس سنوات أو حسب رغبتك
        <span style={{ display: "inline-block", width: 80 }}></span>
        كل استفساراتك يجيبك عليها فريق الكنترول روم أو صفحة "استثمر معنا"
        <span style={{ display: "inline-block", width: 80 }}></span>
        الاشتراك في أنظمتنا شرعي 100%
        <span style={{ display: "inline-block", width: 80 }}></span>
        استثمر معنا اليوم 🚀 لا يردك إلا أرباحك!
        <span style={{ display: "inline-block", width: 80 }}></span>
        اقدم واستثمر في DASM-e والله لو قالت الهيلا استثمر اني استثمر
      </Marquee>
    </div>
  );
} 