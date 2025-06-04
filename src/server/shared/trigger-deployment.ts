export default async function triggerDeployment() {
  return fetch(`https://${process.env.PUBLISH_DEPLOY}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
}
