import { Layout } from "components";

export default async function GearPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Layout title={`Gear Details`}>
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2>Placeholder for Gear: {id}</h2>
        <p>This page will display detailed information about this specific piece of gear.</p>
      </div>
    </Layout>
  );
}
