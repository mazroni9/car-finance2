import Image from 'next/image';

interface SafeImageProps {
  src?: string | string[];
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "object-cover",
  fallbackSrc = "/images/default-car.jpg"
}: SafeImageProps) {
  // إذا كان src مصفوفة، خذ العنصر الأول
  const imageSrc = Array.isArray(src) ? src[0] : src;
  
  // تحقق من صحة الصورة
  const isValidImage = imageSrc && 
    (imageSrc.startsWith('/') || 
     imageSrc.startsWith('http://') || 
     imageSrc.startsWith('https://'));
  
  // استخدم الصورة الافتراضية إذا لم تكن الصورة صحيحة
  const finalSrc = isValidImage ? imageSrc : fallbackSrc;

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width || 300}
      height={height || 200}
      className={className}
    />
  );
} 