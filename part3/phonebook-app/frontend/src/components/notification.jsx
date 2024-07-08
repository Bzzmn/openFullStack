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
        case 'success':
            return (
                <div className='success'>
                  {message}
                </div>
              );
        default:
            console.log('type of Notification not exists')
    }
}

export default Notification