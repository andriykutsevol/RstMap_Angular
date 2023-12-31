import {AbstractControl} from '@angular/forms';

export class EmailValidator {



  public static validate(c:AbstractControl) {

    let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return (c) => {
      return (EMAIL_REGEXP.test(c.value)) ? null : {
        passwordsEqual: {
          valid: false
        }
      };
    }

    // return () => {
    //   return {passwordsEqual: {
    //     valid: false
    //     }
    //   }
    // };


  }



}
