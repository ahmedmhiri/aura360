// Renders a schema.org JSON-LD block. Server component — the data is
// serialized once at render time.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
