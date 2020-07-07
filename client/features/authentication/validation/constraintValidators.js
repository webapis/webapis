
import validationMessages from './validationMessages';
import { emailRegex, passwordRegex, usernameRegex } from './validationRegex';
export function validateEmailConstraint({ email }) {
  const emailConstraint = new RegExp(emailRegex);

  if (emailConstraint.test(email)) {
    return {
      isValid: true,
      message: '',
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_EMAIL,
    };
  }
}


export function validatePasswordConstraint({ password }) {
  const passwordConstraint = new RegExp(passwordRegex);
  if (passwordConstraint.test(password)) {
    return {
      isValid: true,
      message: '',
    };
  }
else{
    return {
     
      isValid: false,
      message: validationMessages.INVALID_PASSWORD,
    };
  
}}

export function validateUserNameConstraint({ username }) {
  const usernameConstraint = new RegExp(usernameRegex);
  if (usernameConstraint.test(username)) {
    return {
    
      isValid: true,
      message: '',
    };
  } else {
    return {

      isValid: false,
      message: validationMessages.INVALID_USERNAME,
    };
  }
}

export function validateEmailOrUsername({ value }) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);

  if (emailConstraint.test(value)) {
    return {
  
      isValid: true,
      message: '',
    };
  } else if (usernameConstraint.test(value)) {
    return {

      isValid: true,
      message: '',
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL,
    };
  }
}



export function validatePasswordMatch({ auth }) {

  const { password, confirm } =auth;

  if (password === '' || password !== confirm) {
    return {
      message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      isValid: false,
    };
  } else {
    return {
      isValid: true,
      message: '',
   
    };
  }
}


export function validateEmptyString ({value}){
  if(value.length===0){
    return {
      message: validationMessages.REQUIRED_FIELD,
      isValid: false,
    };
  }else{
    return {
      message:'',
      isValid: true,
    };
  }
}