export default function Filter(){
    const isMobile = screen.height < screen.width;
    const filterClass = () => {
        return isMobile ? "h-[100%] w-[10%] bg-secondary text-primary dark:text-primary-dark pl-4 text-lg" : "";
    }
    return(
        <div className={filterClass()}>Filters</div>
    )
}