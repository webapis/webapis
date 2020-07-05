import { h } from 'preact'
import { AppRoute } from 'components/app-route';
import Button from './button'
import TextInput from './text-input'
export default function ComponentsRoute(){

    return [
        <AppRoute path="/button">
        <Button/>
      </AppRoute>,
      <AppRoute path="/text-input">
      <TextInput/>
      </AppRoute>
    ]
}