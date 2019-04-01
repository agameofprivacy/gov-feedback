import React, {Component} from "react";
import BaseModal from "./BaseModal";
import {Formik} from "formik";
import * as Yup from "yup";

const remote = "https://gov-feedback.appspot.com";
const local = "http://localhost:3001";

const host = local;

const ProfileSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email格式不符')
      .nullable(),
    birthday: Yup.string()
      .matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "日期格式不符"),
    gender: Yup.string()
      .nullable(),
    residence: Yup.string()
      .nullable(),
  });
  

class ProfileModal extends Component {

    closeProfileModal = () => {
        this.props.setFormState({showsProfileModal: false});
    }

    updateProfile = (profileInput, callback) => {
        console.log("create profile");
        console.log("profileInput", profileInput);
        fetch(`${host}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            query: `
              mutation($profileInput: ProfileInput){
                updateProfile(input: $profileInput) {
                  user
                  birthday
                  gender
                  residence
                  email
                }
              }
            `,
            variables: { profileInput }
          })
        })
          .then(r => r.json())
          .then(response => {
            callback(response);
          });
      };

    render() {

        var footerActions = [];

        const { birthday, gender, residence, email } = this.props;

        return (
            <BaseModal medium title="個人資料" headerAction={this.closeProfileModal} headerActionIcon="close" footerActions={footerActions}>
                    <Formik
                        initialValues={{ birthday: birthday, gender: gender, residence: residence, email: email }}
                        validationSchema={ProfileSchema}
                        // validate={values => {
                        //     let errors = {};
                        //     // if (!values.email) {
                        //     //     errors.email = '必填';
                        //     // } 
                            
                        //     if (
                        //     values.email !== "" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        //     ) {
                        //     errors.email = '非正確格式之Email';
                        //     }
                        //     // if (!values.gender) {
                        //     //     errors.gender = '必填';
                        //     // }
    
                        //     return errors;
                        // }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                            // alert(JSON.stringify(values, null, 2));
                            var input = {};
                            if (values.email !== "") {
                                input["email"] = values.email;
                            }
                            if (values.birthday !== "") {
                                input["birthday"] = values.birthday;
                            }
                            if (values.gender !== "") {
                                input["gender"] = values.gender;
                            }
                            if (values.residence !== "") {
                                input["residence"] = values.residence;
                            }

                            input.user = this.props.user_id;
                            console.log("update input:", input);
                            this.updateProfile(
                                input,
                                function(r) {
                                  console.log(r);
                                  console.log("save profile", r.data);
                                  var update = r.data.updateProfile;
                                  if (update !== null) {
                                    var toUpdate = {};
                                    if (update.email !== null && update.email !== "") {
                                      toUpdate.email = update.email;
                                    }
                                    if (update.birthday !== null && update.birthday !== "") {
                                      toUpdate.birthday = update.birthday;
                                    }
                                    if (update.gender !== null && update.gender !== "") {
                                      toUpdate.gender = update.gender;
                                    }
                                    if (update.residence !== null && update.residence !== "") {
                                      toUpdate.residence = update.residence;
                                    }
        
                                    this.props.setFormState(toUpdate)  
                                  }
                                  setSubmitting(false);
                                  this.closeProfileModal();
                                }.bind(this)
                              );
                            }, 400);
                        }}
                        >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            /* and other goodies */
                        }) => {
                            console.log("touched", Object.keys(touched).length === 0);
                            console.log("errors", errors);
                            return (
                            <form className="form" onSubmit={handleSubmit}>
                                <table className="form__section">
                                    <tbody>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                生日
                                                <br/><span className="form__section__row__error">{errors.birthday && errors.birthday}</span>
                                            </td>
                                            <td className="form__section__row__input">
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.birthday}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                性別
                                                <br/><span className="form__section__row__error">{errors.gender && errors.gender}</span>
                                            </td>
                                            <td className="form__section__row__input">
                                                <input
                                                    id="male"
                                                    type="radio"
                                                    name="gender"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value="male"
                                                    checked={values.gender === "male"}
                                                />
                                                <label htmlFor="male">男</label>
                                                <input
                                                    id="female"
                                                    type="radio"
                                                    name="gender"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value="female"
                                                    checked={values.gender === "female"}
                                                />
                                                <label htmlFor="female">女</label>
                                                <input
                                                    id="other"
                                                    type="radio"
                                                    name="gender"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value="other"
                                                    checked={values.gender === "other"}
                                                />
                                                <label htmlFor="other">其他</label>
                                                <br/>
                                            </td>
                                        </tr>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                居住地
                                                <br/><span className="form__section__row__error">{errors.residence && errors.residence}</span>
                                            </td>
                                            <td className="form__section__row__input">
                                                <input
                                                    type="text"
                                                    name="residence"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.residence}
                                                />
                                                <br/>
                                            </td>
                                        </tr>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                Email
                                                <br/><span className="form__section__row__error">{errors.email && errors.email}</span>
                                            </td>
                                            <td className="form__section__row__input">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.email}
                                                />
                                                <br/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="modal__dialog__footer">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting || Object.keys(errors).length > 0}
                                        key="footer-save-details"
                                        id="modal-save-details"
                                        onClick={this.saveDetails}
                                        className={"modal__dialog__footer__action modal__dialog__footer__action--primary" + (isSubmitting || Object.keys(errors).length > 0 ? " modal__dialog__footer__action--disabled" : "")}                        
                                    >
                                        儲存
                                    </button>
                                </div>
                            </form>
                        )
                        }}
                    </Formik>

            </BaseModal>
        )
    }
}

export default ProfileModal;