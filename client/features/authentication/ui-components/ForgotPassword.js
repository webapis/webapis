import { h } from 'preact';
import TextInput from 'controls/text-input';
import Button from 'controls/button';
import Alert from 'controls/alert'
export default function RequestPassChange(props) {
  const { email, validation, onRequestPasswordChange, loading, onChange,error } = props


  return (

    <div className="col-md-4 border mx-auto rounded" style={{ margin: 15, padding: 16 }}>
      {loading && <div className="progress" style="height: 5px;">
        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
      </div>}
      {error && <Alert alert="danger" message={error.message}/>}
      <TextInput
        label="Email"
        value={email}
     
        name='email'
        onChange={onChange}
        type='email'
        id='email'
        isValid={validation && validation['email'].isValid}
        message={validation && validation['email'].message}

    
      />
      <Button

        type='button'
        onClick={onRequestPasswordChange}
        data-testid="requestpasschange-btn"
        title="Request password change"
        loading={loading}
        bg="primary"

      />



    </div>
  );
}
