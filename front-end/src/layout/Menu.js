import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element} Menu component JSX
 */
function Menu() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark text-light">
            <div className="container d-flex align-items-center md-offset-2">
                {/* Brand/logo */}
                <Link className="navbar-brand" to="/">
                    Periodic Tables
                </Link>

                {/* Navbar toggler for responsive design */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar links */}
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul
                        className="nav navbar-nav text-light"
                        id="accordionSidebar"
                    >
                        {/* Dashboard link */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">
                                <span className="oi oi-dashboard" />
                                &nbsp;Dashboard
                            </Link>
                        </li>

                        {/* Search link */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">
                                <span className="oi oi-magnifying-glass" />
                                &nbsp;Search
                            </Link>
                        </li>

                        {/* New Reservation link */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/reservations/new">
                                <span className="oi oi-plus" />
                                &nbsp;New Reservation
                            </Link>
                        </li>

                        {/* New Table link */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/tables/new">
                                <span className="oi oi-layers" />
                                &nbsp;New Table
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Menu;
