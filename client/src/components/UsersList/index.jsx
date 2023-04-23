import { useEffect } from 'react';
import { connect } from 'react-redux';
import BeatLoader from 'react-spinners/BeatLoader';
import styles from './UsersList.module.sass';
import defImage from './defaultPhoto.jpg';
import { deleteUserThunk, getUsersThunk } from '../../store/slices/usersSlice';

export const UsersList = ({ users, isFetching, error, get, remove }) => {
  useEffect(() => {
    get();
  }, []);

  return (
    <>
      <BeatLoader loading={isFetching} />
      {error && <div>!!!ERROR!!!</div>}
      <ul>
        {users.map(u => (
          <li key={u.id}>
            <button
              onClick={() => {
                remove(u.id);
              }}
            >
              X
            </button>
            <img
              className={styles.userImage}
              src={u.image ? `http://localhost:5000/${u.image}` : defImage}
              alt={`${u.firstName} ${u.lastName}`}
            />
            {JSON.stringify(u)}
          </li>
        ))}
      </ul>
    </>
  );
};

const mapStateToProps = ({ usersData }) => usersData;

const mapDispatchToProps = dispatch => ({
  get: () => dispatch(getUsersThunk()),
  remove: id => dispatch(deleteUserThunk(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
