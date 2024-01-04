const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
    switch(type){
        case 'error':
            return (
                <div className='error'>
                  {message}
                </div>
              );
            break;
        case 'success':
            return (
                <div className='success'>
                  {message}
                </div>
              );
            break;
        default:
            console.log('type of Notification not exists')
    }
}

export default Notification