import {h} from 'preact'
import ForgotPassword from 'features/authentication/ui-components/ForgotPassword'
const validationSuccess ={email:{isValid:true,message:'.'}}
const validationError ={email:{isValid:false,message:'Invalid email format'}}
export default function ForfotPasswordState (){
    return <div className="container">
        <div className="row" > 
            <span className="col-md-12">
                <h5 className="text-center"> ForgotPassword Validation Success</h5>
           
              <ForgotPassword email="test@gmail.com"    validation={validationSuccess} />
         
              
            </span>
            </div>
            <div className="row" > 
            <span className="col-md-12">
                <h5 className="text-center">ForgotPassword Validation Error</h5>
           
              <ForgotPassword   email="testgmail.com"    validation={validationError} />
         
              
            </span>
            </div>
            <div className="row" > 
            <span className="col-md-12">
                <h5 className="text-center">Request Password Change in progress</h5>
           
              <ForgotPassword email="test@gmail.com"      validation={validationSuccess} loading />
         
              
            </span>
            </div>
    </div>
}