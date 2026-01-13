import { SectionTitle } from "@/components/ui/SectionTitle";
import MapEmbed from "@/components/widgets/MapEmbed.client";

type Props = {
  contact: any;
};

export default function CTA({ contact }: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] items-start">
      <div>
        <SectionTitle
          id="contact-heading"
          title="Ready to shop everything?"
          lead="Browse now or message us with what you're looking for – we'll help you find the best deals and options."
        />
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Phone:</span> {contact.phone}
          </p>
          {contact.whatsapp && (
            <p>
              <span className="font-semibold">WhatsApp:</span>{" "}
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4">
                {contact.whatsapp}
              </a>
            </p>
          )}
          <p>
            <span className="font-semibold">Email:</span> {contact.email}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {contact.address}
          </p>
          {contact.hours && (
            <p>
              <span className="font-semibold">Hours:</span> {contact.hours}
            </p>
          )}
          <p className="text-xs text-slate-600 pt-2">
            To request a quote, simply send us a WhatsApp or email with your
            details and we will respond with options, stock availability and
            rounded ZAR pricing.
          </p>
        </div>
      </div>
      <div>
        <MapEmbed
          embedSrc={contact.mapEmbedSrc}
          query={contact.mapQuery}
          title="IVA location in  Klerksdorp"
          className="w-full"
        />
      </div>
    </div>
  );
}
