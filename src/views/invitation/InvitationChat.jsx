import React from 'react';
import EnquiryChatPage from '../mehandi/EnquiryChatPage';

const InvitationChat = () => {
    // We can reuse the same EnquiryChatPage and pass module specific filters if needed
    // or just rely on the existing logic which likely handles module switching via state
    return <EnquiryChatPage module="invitation" />;
};

export default InvitationChat;
