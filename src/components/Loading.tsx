const Loading = () => {
    return (
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium">Loading user data...</p>
            </div>
        </div>
    );
};

export default Loading;
