import React from 'react'

type SliderImages = {
    img1: string;
    img2: string;
    img3: string;
    img4: string;
}[];
export const ProductImagesSlider = ({ img1, img2, img3, img4 }: SliderImages) => {
    const images = [img1, img2, img3, img4].filter(Boolean) as string[];
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    const openSlider = (index: number) => setActiveIndex(index);
    const closeSlider = () => setActiveIndex(null);

    const next = () => {
        if (activeIndex !== null) setActiveIndex((activeIndex + 1) % images.length);
    };

    const prev = () => {
        if (activeIndex !== null)
            setActiveIndex((activeIndex - 1 + images.length) % images.length);
    };
    return (
        <>
            <div className="p-6 grid grid-cols-2 gap-4">
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        onClick={() => openSlider(i)}
                        className="cursor-pointer rounded-xl shadow-md hover:scale-[1.02] transition"
                    />
                ))}

                {activeIndex !== null && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="relative">
                            <img
                                src={images[activeIndex]}
                                className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-lg"
                            />

                            {/* Close Button */}
                            <button
                                className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow"
                                onClick={closeSlider}
                            >
                                ✕
                            </button>

                            {/* Prev */}
                            <button
                                className="absolute left-[-60px] top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow"
                                onClick={prev}
                            >
                                ‹
                            </button>

                            {/* Next */}
                            <button
                                className="absolute right-[-60px] top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow"
                                onClick={next}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
