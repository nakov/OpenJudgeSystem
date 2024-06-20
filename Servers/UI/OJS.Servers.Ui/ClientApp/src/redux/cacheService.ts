import { setContests } from './features/contestsSlice';
import { useAppDispatch } from './store';

interface ICacheServiceContext {
    resetCache: () => void;
}

const CacheService = (): ICacheServiceContext => {
    const dispatch = useAppDispatch();

    const resetContests = () => {
        dispatch(setContests(null));
    };

    const resetCache = () => {
        resetContests();
    };

    return { resetCache };
};

export default CacheService;
