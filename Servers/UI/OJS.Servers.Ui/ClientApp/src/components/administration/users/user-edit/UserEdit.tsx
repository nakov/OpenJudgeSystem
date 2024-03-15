// /* eslint-disable no-case-declarations */
// /* eslint-disable no-undefined */
// /* eslint-disable prefer-destructuring */
// /* eslint-disable react/jsx-props-no-spreading */
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Button, TextField, Typography } from '@mui/material';
//
// import {
//     ExceptionData,
//      IUserAdministration,
// } from '../../../../common/types';
// import {
//     useCreateUserMutation,
//     useGetUserByIdQuery,
//     useUpdateUserMutation,
// } from '../../../../redux/services/admin/usersAdminService';
// import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant,
// AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
// import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
// import DeleteButton from '../../common/delete/DeleteButton';
//
// // eslint-disable-next-line css-modules/no-unused-class
// import styles from './UserEdit.module.scss';
//
// interface IUserEditProps {
//     userId: number | null;
//     isEditMode?: boolean;
// }
//
// const UserEdit = (props:IUserEditProps) => {
//     const { userId, isEditMode = true } = props;
//
//     const navigate = useNavigate();
//     const [ errorMessages, setErrorMessages ] = useState<Array<ExceptionData>>([]);
//     const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
//     const [ isValidForm, setIsValidForm ] = useState<boolean>(!!isEditMode);
//
//     const [ user, setUser ] = useState<IUserAdministration>({
//         id: 0,
//         username: '',
//         isDeleted: false,
//         createdOn: null,
//         deletedOn: null,
//     });
//     const [ userValidations, setUserValidations ] = useState({
//         isNameTouched: false,
//         isNameValid: !!isEditMode,
//     });
//
//     const { data, isFetching, isLoading } = useGetUserByIdQuery({ id: Number(userId) },
//     { skip: !isEditMode });
//
//     const [
//         updateUser, {
//             data: updateData,
//             isLoading: isUpdating,
//             isSuccess:
//                 isSuccesfullyUpdated,
//             error: updateError,
//         } ] = useUpdateUserMutation();
//
//     const [
//         createUser, {
//             data: createData,
//             isSuccess: isSuccesfullyCreated,
//             error: createError,
//             isLoading: isCreating,
//         } ] = useCreateUserMutation();
//
//     useEffect(
//         () => {
//             if (data) {
//                 setUser(data);
//             }
//         },
//         [ data ],
//     );
//
//     useEffect(() => {
//         setErrorMessages([]);
//         if (isSuccesfullyUpdated) {
//             setSuccessMessage(updateData as string);
//             setErrorMessages([]);
//         } if (isSuccesfullyCreated) {
//             setSuccessMessage(createData as string);
//             setErrorMessages([]);
//         }
//     }, [ isSuccesfullyUpdated, updateData, createData, isSuccesfullyCreated ]);
//
//     useEffect(() => {
//         if (updateError && !isSuccesfullyUpdated) {
//             setSuccessMessage(null);
//             setErrorMessages(updateError as Array<ExceptionData>);
//         } else if (createError && !isSuccesfullyCreated) {
//             setSuccessMessage(null);
//             setErrorMessages(createError as Array<ExceptionData>);
//         } else {
//             setErrorMessages([]);
//         }
//     }, [ createError, isSuccesfullyCreated, isSuccesfullyUpdated, updateError ]);
//
//     const validateForm = () => {
//         const isValid = userValidations.isNameValid;
//         setIsValidForm(isValid);
//     };
//
//     const onChange = (e: any) => {
//         // eslint-disable-next-line prefer-destructuring
//         const { name, value } = e.target;
//         let {
//             id,
//             username,
//         } = user;
//         const currentUserValidations = userValidations;
//         // eslint-disable-next-line default-case
//         switch (name) {
//         case 'username':
//             username = value;
//             currentUserValidations.isNameTouched = true;
//             currentUserValidations.isNameValid = true;
//             // TODO fix
//             if (value.length < 2 || value.length > 100) {
//                 currentUserValidations.isNameValid = false;
//             }
//             break;
//         }
//         setUserValidations(currentUserValidations);
//         setUser((prevState) => ({
//             ...prevState,
//             username,
//         }));
//         validateForm();
//     };
//
//     const edit = () => {
//         if (isValidForm) {
//             updateUser(user);
//         }
//     };
//
//     const create = () => {
//         if (isValidForm) {
//             createUser(user);
//         }
//     };
//
//     return (
//         isFetching || isLoading || isUpdating || isCreating
//             ? <SpinningLoader />
//             : (
//                 <div className={`${styles.flex}`}>
//                     {errorMessages.map((x, i) => (
//                         <Alert
//                           key={x.name}
//                           variant={AlertVariant.Filled}
//                           vertical={AlertVerticalOrientation.Top}
//                           horizontal={AlertHorizontalOrientation.Right}
//                           severity={AlertSeverity.Error}
//                           message={x.message}
//                           styles={{ marginTop: `${i * 4}rem` }}
//                         />
//                     ))}
//                     {successMessage && (
//                         <Alert
//                           variant={AlertVariant.Filled}
//                           autoHideDuration={3000}
//                           vertical={AlertVerticalOrientation.Top}
//                           horizontal={AlertHorizontalOrientation.Right}
//                           severity={AlertSeverity.Success}
//                           message={successMessage}
//                         />
//                     )}
//                     <Typography className={styles.centralize} variant="h4">
//                         {username || 'User form'}
//                     </Typography>
//                     <form className={`${styles.form}`}>
//                         <Box>
//                             {isEditMode && (
//                                 <TextField
//                                   className={styles.inputRow}
//                                   label="Exam Group Id"
//                                   variant="standard"
//                                   value={user.id}
//                                   disabled
//                                 />
//                             )}
//                             <TextField
//                               className={styles.inputRow}
//                               label="Username"
//                               variant="standard"
//                               name="username"
//                               onChange={(e) => onChange(e)}
//                               value={user.username}
//                               color={userValidations.isNameValid && userValidations.isNameTouched
//                                   ? 'success'
//                                   : 'primary'}
//                               error={(userValidations.isNameTouched &&
//                               !userValidations.isNameValid)}
//                                 // eslint-disable-next-line max-len
//                               helperText={(userValidations.isNameTouched &&
//                               !userValidations.isNameValid) && 'Username length
//                               must be between 4 and 100 characters long'}
//                             />
//                         </Box>
//                     </form>
//                     {isEditMode
//                         ? (
//                             <div className={styles.buttonsWrapper}>
//                                 <Button
//                                   variant="contained"
//                                   onClick={() => edit()}
//                                   className={styles.button}
//                                   disabled={!isValidForm}
//                                 >
//                                     Edit
//                                 </Button>
//                             </div>
//                         )
//                         : (
//                             <div className={styles.buttonsWrapper}>
//                                 <Button
//                                   variant="contained"
//                                   onClick={() => create()}
//                                   className={styles.button}
//                                   disabled={!isValidForm}
//                                 >
//                                     Create
//                                 </Button>
//                             </div>
//                         )}
//                     <Box sx={{ alignSelf: 'flex-end' }}>
//                         <DeleteButton
//                           id={Number(userId!)}
//                           name={user.username}
//                           onSuccess={() => navigate('/administration-new/users')}
//                           mutation={useDeleteUserMutation}
//                           text="Are you sure that you want to delete the user?"
//                         />
//                     </Box>
//                 </div>
//             )
//     );
// };
//
// export default UserEdit;
export default {};
