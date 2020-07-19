import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { AppRoute } from "components/app-route";
import Button from "./button";
import TextInput from "./text-input";
import ToastDemo from "./toast";
import AlertDemo from "./alert";
export default function ComponentsRoute() {
  return [
    <AppRoute path="/button">
      <Button />
    </AppRoute>,
    <AppRoute path="/text-input">
      <TextInput />
    </AppRoute>,
    <AppRoute path="/toast">
      <ToastDemo />
    </AppRoute>,
    <AppRoute path="/alert">
      <AlertDemo />
    </AppRoute>,
  ];
}
