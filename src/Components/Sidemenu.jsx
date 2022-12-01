import '../Styles/SideMenu/Sidemenu.css';
import '../Styles/SideMenu/semi-dark.css';
import { Logout } from '../Layout/Logout';

export function Sidemenu() {
    return (
        <>
            {/* start top header */}
            <header className="top-header">
                <nav className="navbar navbar-expand gap-3">
                    <div className="mobile-toggle-icon fs-3">
                        <i className="bi bi-list"></i>
                    </div>
                    <form className="searchbar">
                        <div className="position-absolute top-50 translate-middle-y search-icon ms-3"><i className="bi bi-search"></i></div>
                        <input className="form-control" type="text" placeholder="Type here to search" />
                        <div className="position-absolute top-50 translate-middle-y search-close-icon"><i className="bi bi-x-lg"></i></div>
                    </form>
                    <div className="top-navbar-right ms-auto">
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item search-toggle-icon">
                                <a className="nav-link" href="#">
                                    <div className="">
                                        <i className="bi bi-search"></i>
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item dropdown dropdown-large">
                                <a className="nav-link dropdown-toggle dropdown-toggle-nocaret px-4" href="#" data-bs-toggle="dropdown">
                                    <div className="notifications">
                                        <span className="notify-badge">4</span>
                                        <img src='/images/SideMenu/NotifyIcon.png' className='img-fluid' />
                                    </div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end p-0">
                                    <div className="p-2 border-bottom m-2">
                                        <h5 className="h5 mb-0">Notifications</h5>
                                    </div>
                                    <div className="header-notifications-list p-2 ps">
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="notification-box bg-light-primary text-primary"><i className="bi bi-basket2-fill"></i></div>
                                                <div className="ms-3 flex-grow-1">
                                                    <h6 className="mb-0 dropdown-msg-user">New Orders <span className="msg-time float-end text-secondary">1 m</span></h6>
                                                    <small className="mb-0 dropdown-msg-text text-secondary d-flex align-items-center">You have recived new orders</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="notification-box bg-light-purple text-purple"><i className="bi bi-people-fill"></i></div>
                                                <div className="ms-3 flex-grow-1">
                                                    <h6 className="mb-0 dropdown-msg-user">New Customers <span className="msg-time float-end text-secondary">7 m</span></h6>
                                                    <small className="mb-0 dropdown-msg-text text-secondary d-flex align-items-center">5 new user registered</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="notification-box bg-light-pink text-pink"><i className="bi bi-gift-fill"></i></div>
                                                <div className="ms-3 flex-grow-1">
                                                    <h6 className="mb-0 dropdown-msg-user">New Comments <span className="msg-time float-end text-secondary">2 w</span></h6>
                                                    <small className="mb-0 dropdown-msg-text text-secondary d-flex align-items-center">New customer comments recived</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="notification-box bg-light-success text-success"><i className="bi bi-lightbulb-fill"></i></div>
                                                <div className="ms-3 flex-grow-1">
                                                    <h6 className="mb-0 dropdown-msg-user">Defense Alerts <span className="msg-time float-end text-secondary">2 h</span></h6>
                                                    <small className="mb-0 dropdown-msg-text text-secondary d-flex align-items-center">45% less alerts last 4 weeks</small>
                                                </div>
                                            </div>
                                        </a>
                                        <div className="ps__rail-x" style={{ left: "0px", bottom: "0px" }}><div className="ps__thumb-x" style={{ left: "0px", width: "0px" }}></div></div><div className="ps__rail-y" style={{ top: "0px", right: "0px" }}><div className="ps__thumb-y" style={{ top: "0px", height: "0px" }}></div></div></div>
                                    <div className="p-2">
                                        <div><hr className="dropdown-divider" /></div>
                                        <a className="dropdown-item" href="#">
                                            <div className="text-center">View All Notifications</div>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item dropdown dropdown-large">
                                <a className="nav-link dropdown-toggle dropdown-toggle-nocaret px-4" href="#" data-bs-toggle="dropdown">
                                    <div className="messages">
                                        <img src='/images/SideMenu/ChatIcon.png' className='img-fluid' />
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item dropdown dropdown-user-setting">
                                <a className="nav-link dropdown-toggle dropdown-toggle-nocaret ps-4" href="#" data-bs-toggle="dropdown">
                                    <div className="user-setting d-flex align-items-center">
                                        <img src="/images/SideMenu/UserImage.png" className="user-img" alt="" />
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <img src="/images/SideMenu/UserImage.png" alt="" className="rounded-circle" width="54" height="54" />
                                                <div className="ms-3">
                                                    <h6 className="mb-0 dropdown-user-name">Jhon Deo</h6>
                                                    <small className="mb-0 dropdown-user-designation text-secondary">HR Manager</small>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <a className="dropdown-item" href="pages-user-profile.html">
                                            <div className="d-flex align-items-center">
                                                <div className=""><i className="bi bi-person-fill"></i></div>
                                                <div className="ms-3"><span>Profile</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className=""><i className="bi bi-gear-fill"></i></div>
                                                <div className="ms-3"><span>Setting</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="index2.html">
                                            <div className="d-flex align-items-center">
                                                <div className=""><i className="bi bi-speedometer"></i></div>
                                                <div className="ms-3"><span>Dashboard</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className=""><i className="bi bi-piggy-bank-fill"></i></div>
                                                <div className="ms-3"><span>Earnings</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className=""><i className="bi bi-cloud-arrow-down-fill"></i></div>
                                                <div className="ms-3"><span>Downloads</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <a className="dropdown-item" href="/logout">
                                            <div className="d-flex align-items-center">
                                                <div className=""><i className="bi bi-lock-fill"></i></div>
                                                <div className="ms-3"><span>Logout</span></div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            {/* end top header */}

            {/* start sidebar */}
            <aside className="sidebar-wrapper" data-simplebar="init">
                <div className="simplebar-wrapper" style={{ margin: "0px" }}>
                    <div className="simplebar-height-auto-observer-wrapper">
                        <div className="simplebar-height-auto-observer"></div>
                    </div>
                    <div className="simplebar-mask">
                        <div className="simplebar-offset" style={{ right: "0px", bottom: "0px" }}>
                            <div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden" }}>
                                <div className="simplebar-content mm-active" style={{ padding: "0px" }}>
                                    <div className="sidebar-header cursor-pointer">
                                        <img src="/images/SideMenu/logo-icon.svg" id="LeftMenuLogo" className="logo-icon" alt="logo icon" />
                                        <div className="toggle-icon ms-auto" id="sidebar-toggle"> <i className="bi bi-list"></i>
                                        </div>
                                    </div>
                                    <ul className="metismenu mm-show" id="menu">
                                        <li>
                                            <a href="/dashboard" changeimg="/images/SideMenu/Icons/DashboardWhite.svg" originalimg="/images/SideMenu/Icons/Dashboard.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/Dashboard.svg' className='img-fluid ChangeImage' title='Create Ticket'/>
                                                </div>
                                                <div className="menu-title">Dashboard</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/CreateTicketWhite.svg" originalimg="/images/SideMenu/Icons/CreateTicket.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/CreateTicket.svg' className='img-fluid ChangeImage' title='Create Ticket'/>
                                                </div>
                                                <div className="menu-title">Create Ticket</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/ManageTicketWhite.svg" originalimg="/images/SideMenu/Icons/ManageTicket.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/ManageTicket.svg' className='img-fluid ChangeImage' title='Manage Ticket'/>
                                                </div>
                                                <div className="menu-title">Manage Ticket</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/ReportWhite.svg" originalimg="/images/SideMenu/Icons/Report.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/Report.svg' className='img-fluid ChangeImage' title='Report'/>
                                                </div>
                                                <div className="menu-title">Report</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/ReportPortalWhite.svg" originalimg="/images/SideMenu/Icons/ReportPortal.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/ReportPortal.svg' className='img-fluid ChangeImage' title='Report Portal'/>
                                                </div>
                                                <div className="menu-title">Report Portal</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/AssignDeviceWhite.svg" originalimg="/images/SideMenu/Icons/AssignDevice.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/AssignDevice.svg' className='img-fluid ChangeImage' title='Assign a Device'/>
                                                </div>
                                                <div className="menu-title">Assign a Device</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/manage-inventory" changeimg="/images/SideMenu/Icons/ManageInventoryWhite.svg" originalimg="/images/SideMenu/Icons/ManageInventory.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/ManageInventory.svg' className='img-fluid ChangeImage' title='Manage Inventory'/>
                                                </div>
                                                <div className="menu-title">Manage Inventory</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/ImportExportInventoryWhite.svg" originalimg="/images/SideMenu/Icons/ImportExportInventory.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/ImportExportInventory.svg' className='img-fluid ChangeImage' title='Import / Export Inventory'/>
                                                </div>
                                                <div className="menu-title">Import / Export Inventory</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/PurchasePartsWhite.svg" originalimg="/images/SideMenu/Icons/PurchaseParts.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/PurchaseParts.svg' className='img-fluid ChangeImage' title='Purchase Parts' />
                                                </div>
                                                <div className="menu-title">Purchase Parts</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" changeimg="/images/SideMenu/Icons/UsersWhite.svg" originalimg="/images/SideMenu/Icons/Users.svg">
                                                <div className="parent-icon">
                                                    <img src='/images/SideMenu/Icons/Users.svg' className='img-fluid ChangeImage' title='Users'/>
                                                </div>
                                                <div className="menu-title">Users</div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="simplebar-placeholder" style={{ width: "auto", height: "1906px" }}></div>
                </div>
                <div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }}>
                    <div className="simplebar-scrollbar" style={{ width: "0px", display: "none" }}></div>
                </div>
                <div className="simplebar-track simplebar-vertical" style={{ visibility: "visible" }}>
                    <div className="simplebar-scrollbar" style={{ height: "69px", transform: "translate3d(0px, 0px, 0px)", display: "block" }}></div>
                </div>
            </aside>
            {/* end sidebar */}
        </>
    )
}