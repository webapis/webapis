import { h } from "preact";
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
