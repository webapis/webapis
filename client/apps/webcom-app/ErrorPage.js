import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useApplication } from "components/app-provider";
export default function ErrorPage() {
  const { state } = useApplication();
  const { error } = state;
  return (
    <div>
      Error Page
      {error && error.message}
    </div>
  );
}
