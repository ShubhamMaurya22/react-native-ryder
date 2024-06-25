import imagePath from './imagePath';

export const VehicleInfo = [
    {
      type: 'Car',
      data: [
        {
          name: 'Maruti Suzuki',
          image: imagePath.suzuki_logo,
          models: [ 'Celerio', 'Swift', 'Baleno','Wagon R',  'Dzire', 'Alto', 'Ertiga','XL6','Vitara Brezza',
          ],
        },
        {
          name: 'Hyundai',
          image:imagePath.hyundai_logo,
            models: [ 'Grand i10','i20','Venue', 'Creta','Verna', 'Aura', 'Tucson',
           
            ],
        },
        {
          name: 'TATA',
          image: imagePath.tata_logo,
          models: ['Altroz', 'Tiago', 'Tigor', 'Nexon', 'Harrier', 'Safari'],
  
        },
        
        {
          name: 'HONDA',
          image: imagePath.honda_logo,
          models: ['City', 'Amaze', 'Jazz', 'WR-V', 'Civic', 'CR-V'],
  
        },
        
      ],
    },
    {
      type: 'Bike',
      data: [
        {
          name: 'Honda',
          image: imagePath.honda_logo,
          models: ['Honda Shine', 'Honda Activa'],
        },
      ],
    },
  ];
  

