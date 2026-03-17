"use client";

import Image from "next/image";

const logos = [
    { src: "https://framerusercontent.com/images/OPToRxvhQd2ScvavfIOXuI6o.svg", alt: "Logoipsum", w: 194, h: 37 },
    { src: "https://framerusercontent.com/images/Ntc48i8GxNtzZe6K8P7DeRLzQ.svg", alt: "Velo Studio", w: 256, h: 42 },
    { src: "https://framerusercontent.com/images/9XfpXOcQrpiKYnZNcFlnYhYZVI.svg", alt: "Urban bites", w: 256, h: 42 },
    { src: "https://framerusercontent.com/images/2rq9YMILXCGw0qOqXvxaPhzIuWo.svg", alt: "Baseline Sports", w: 279, h: 42 },
    { src: "https://framerusercontent.com/images/rHPu3YfQxZrz1Xw15tIQTPQIsU.svg", alt: "Northcap Supply", w: 222, h: 40 },
    { src: "https://framerusercontent.com/images/OEklTYyEPGkk7846aK5rBd4nfcs.svg", alt: "Logoipsum", w: 220, h: 37 },
];

export default function LogoMarquee() {
    // Duplicate for seamless loop
    const items = [...logos, ...logos];

    return (
        <div className="w-full overflow-hidden border-y border-black/10" style={{ height: 132 }}>
            <div
                className="flex items-center h-full animate-marquee-rtl"
                style={{ width: "max-content" }}
            >
                {items.map((logo, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center shrink-0"
                        style={{ width: 286, height: "100%", borderRight: "1px solid rgba(0,0,0,0.1)", paddingLeft: 40, paddingRight: 40 }}
                    >
                        <Image
                            src={`${logo.src}?width=${logo.w * 2}&height=${logo.h * 2}`}
                            alt={logo.alt}
                            width={160}
                            height={52}
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
