export function Pagination(){
    return(
        <>
            <div className="d-flex justify-content-center align-items-center">
                <div><i class="bi bi-caret-left-fill"></i></div>
                <div className="mx-3 d-flex justify-content-center align-items-center">
                    <span className="PaginationClass">1</span>
                    <span className="PaginationClass ActivePagination">2</span>
                    <span className="PaginationClass">3</span>
                    <span className="PaginationClass">4</span>
                </div>
                <div><i class="bi bi-caret-right-fill"></i></div>
            </div>
        </>
    )
}