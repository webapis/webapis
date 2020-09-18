export default async function protocolSender({ protocol }) {
  try {
    let response = await fetch("/hangout-protocol", {
      method: "post",
      body: JSON.stringify(protocol),
    });
  } catch (error) {
    throw error;
  }
}
