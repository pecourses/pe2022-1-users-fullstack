import React from 'react';
import UsersList from '../../components/UsersList';
import UserForm from '../../components/forms/UserForm';

function UserPage () {
  return (
    <section>
      <h2>User Form</h2>
      <UserForm />
      <UsersList />
    </section>
  );
}

export default UserPage;
