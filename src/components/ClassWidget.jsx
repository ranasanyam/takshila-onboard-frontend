import React from 'react';


const ClassWidget = ({classWidgets}) => {
    
    return (
        <div>
            <h2 style={{ textAlign: 'center', marginTop: '30px'}}>Class Widgets</h2>
            <div
            style={{
                display:'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 250px))',
                gap: '20px',
                padding: '20px'
            }}
            >
            {Object.keys(classWidgets).map((className) => (
                <div key={className}
                style={{ 
                    border: '1px solid black', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                    padding: '20px',
                    backgroundColor: '#DCFAFA'
                }}
                >
                    <h3 style={{
                        color: "#333",
                        marginBottom: '10px',
                        paddingBottom: '5px'
                    }}>Class: {className}</h3>
                    <ul style={{ listStyleType: 'none', padding: '0', margin: '0'}}>
                        {classWidgets[className].map((student, index) => (
                            <li 
                            key={index}
                            className='w-fit'
                            style={{
                                marginBottom: '10px',
                                padding: '8px',
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}
                            >
                                {Object.entries(student).filter(([key]) => key !== 'id').map(([key, value]) => (
                                    <span key={key} style={{ display: 'block', fontSize: '14px', color:'#555'}}>
                                        <strong>{key}:</strong> {value}{" "}
                                    </span>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            </div>
        </div>
    )
}

export default ClassWidget;