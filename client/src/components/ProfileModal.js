import React, {Component} from "react";
import BaseModal from "./BaseModal";
import {Formik} from "formik";

class ProfileModal extends Component {

    closeProfileModal = () => {
        this.props.setFormState({showsProfileModal: false});
    }

    render() {

        var footerActions = [];

        return (
            <BaseModal medium title="個人資料" headerAction={this.closeProfileModal} headerActionIcon="close" footerActions={footerActions}>
                    <Formik
                        initialValues={{ birthday: '', gender: '', residence: '', email: '' }}
                        validate={values => {
                            let errors = {};
                            if (!values.email) {
                            errors.email = 'Required';
                            } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                            errors.email = 'Invalid email address';
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
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
                        }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <table className="form__section">
                                    <tbody>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                生日
                                            </td>
                                            <td className="form__section__row__input">
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.birthday}
                                                />
                                                {errors.birthday && touched.birthday && errors.birthday}
                                            </td>
                                        </tr>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                性別
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
                                                {errors.gender && touched.gender && errors.gender}
                                            </td>
                                        </tr>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                居住地
                                            </td>
                                            <td className="form__section__row__input">
                                                <input
                                                    type="text"
                                                    name="residence"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.residence}
                                                />
                                                {errors.residence && touched.residence && errors.residence}
                                            </td>
                                        </tr>
                                        <tr className="form__section__row">
                                            <td className="form__section__row__key">
                                                Email
                                            </td>
                                            <td className="form__section__row__input">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.email}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {errors.email && touched.email && errors.email}
                                <div className="modal__dialog__footer">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        key="footer-save-details"
                                        id="modal-save-details"
                                        onClick={this.saveDetails}
                                        className="modal__dialog__footer__action modal__dialog__footer__action--primary"                        
                                    >
                                        儲存
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>

            </BaseModal>
        )
    }
}

export default ProfileModal;