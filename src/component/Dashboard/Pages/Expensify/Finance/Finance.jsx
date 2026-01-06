import React from 'react'
import profile from '../../../../../assets/Images/profile-img.png'
import { ChevronRight } from 'lucide-react'
import FinanceController from '../../../ExpensifyComponent/FinanceComponent/FinanceController'

const Finance = () => {
  return (
    <div className='account'>
        <div className="headerContainer row">
        <div className="headerParent col-lg-12">
          <div className="headerChild">
            <div className="topWrapper">
              <div className="leftTopWrapper">
                <h1>Expensify</h1>
                <span> <ChevronRight size={16} /> </span>
                <span>Finance</span>
              </div>
              <div className="rightTopWrapper">
                <div className="menuicon">
                {/* <HelpOutlineIcon  className='topicons' /> */}
                <div className="notification">
                    <svg  className='topicons' width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.0154 16.5V17.25C12.0154 18.0456 11.6993 18.8087 11.1367 19.3713C10.5741 19.9339 9.81102 20.25 9.01537 20.25C8.21972 20.25 7.45666 19.9339 6.89405 19.3713C6.33144 18.8087 6.01537 18.0456 6.01537 17.25V16.5M17.0629 14.9733C15.8591 13.5 15.0093 12.75 15.0093 8.68828C15.0093 4.96875 13.1099 3.64359 11.5466 3C11.339 2.91469 11.1435 2.71875 11.0802 2.50547C10.806 1.57219 10.0372 0.75 9.01537 0.75C7.99349 0.75 7.22427 1.57266 6.95287 2.50641C6.88959 2.72203 6.69412 2.91469 6.48646 3C4.92131 3.64453 3.02381 4.965 3.02381 8.68828C3.02146 12.75 2.17162 13.5 0.967868 14.9733C0.469118 15.5836 0.905993 16.5 1.77834 16.5H16.2571C17.1247 16.5 17.5588 15.5808 17.0629 14.9733Z" stroke="#828282" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <div className="notificationtext">2</div>
                </div>
              </div>
              <div className="menuProfile">
                <div className="profileImg">
                    <img src={profile} alt="" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="account-component">
          <FinanceController />
        </div>
    </div>
  )
}

export default Finance
