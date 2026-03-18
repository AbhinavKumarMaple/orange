import { getTestimonials } from "@/lib/queries";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();
    return <TestimonialsClient initialData={testimonials} />;
}
