import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceByIdServer, getServiceReviewsServer } from "@/lib/services/serverQueries";
import ServiceDetailClient from "@/components/service/ServiceDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = await getServiceByIdServer(id);

  if (!service) {
    return { title: "Service Not Found | GetServiHub" };
  }

  const providerName = service.profiles?.business_name || service.profiles?.full_name || "Provider";
  const title = `${service.title} — ${providerName} in ${service.city} | GetServiHub`;
  const description = service.description
    ? service.description.slice(0, 155)
    : `${service.title} by ${providerName} in ${service.city}, San Diego County. Contact directly through GetServiHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: service.image_url ? [service.image_url] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceByIdServer(id);

  if (!service) {
    notFound();
  }

  const reviews = await getServiceReviewsServer(id);
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;
  const providerName = service.profiles?.business_name || service.profiles?.full_name || "Provider";

  const serviceSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.categories?.name || "Local Service",
    name: service.title,
    description: service.description,
    areaServed: {
      "@type": "City",
      name: service.city,
    },
    provider: {
      "@type": "LocalBusiness",
      name: providerName,
    },
  };

  if (service.price_from) {
    serviceSchema.offers = {
      "@type": "Offer",
      price: service.price_from,
      priceCurrency: "USD",
    };
  }

  if (avgRating && reviews.length > 0) {
    serviceSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServiceDetailClient service={service} initialReviews={reviews} serviceId={id} />
    </>
  );
}
