import {
  atelierContact,
  atelierStudio,
  studioAddressLines,
  studioHoursText,
  studioMapsUrl,
  studioPhoneHref,
} from "@/data/atelier";

type StudioVisitProps = {
  className?: string;
};

export function StudioVisit({ className }: StudioVisitProps) {
  return (
    <address className={className}>
      <strong>{atelierStudio.name}</strong>
      <br />
      {studioAddressLines().map((line) => (
        <span key={line}>
          {line}
          <br />
        </span>
      ))}
      {studioHoursText()}
      <br />
      <a href={studioPhoneHref()}>{atelierContact.phoneDisplay}</a>
      <br />
      <a href={studioMapsUrl()} target="_blank" rel="noopener noreferrer">
        Open in Maps
      </a>
    </address>
  );
}
