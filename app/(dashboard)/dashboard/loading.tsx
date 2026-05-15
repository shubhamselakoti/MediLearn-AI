export default function Loading() {
  return (
    <div className="page-in">
      <div className="mb-6">
        <div className="skeleton h-8 w-72 mb-2" />
        <div className="skeleton h-4 w-96" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[1,2,3,4].map(i=>(
          <div key={i} className="glass-card p-4">
            <div className="skeleton h-10 w-10 rounded-xl mb-3"/>
            <div className="skeleton h-7 w-20 mb-1"/>
            <div className="skeleton h-3 w-28 mb-2"/>
            <div className="skeleton h-3 w-24"/>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {[1,2].map(i=>(
          <div key={i} className="glass-card p-5">
            <div className="skeleton h-5 w-40 mb-1"/>
            <div className="skeleton h-3 w-56 mb-5"/>
            <div className="skeleton h-32 w-full rounded-xl"/>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1,2].map(i=>(
          <div key={i} className="glass-card p-5">
            <div className="skeleton h-5 w-36 mb-4"/>
            <div className="skeleton h-40 w-full rounded-xl"/>
          </div>
        ))}
      </div>
    </div>
  );
}
