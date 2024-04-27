import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const SortingPerformanceChart = () => {
  const [arraySize, setArraySize] = useState(10); // Varsayılan dizi boyutu
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]); // Seçilen sıralama algoritmaları
  const [performanceData, setPerformanceData] = useState({}); // Sıralama algoritmalarının performans verileri

  // Sıralama algoritmalarını içeren bir obje
  const sortingAlgorithms = {
    bubbleSort: function(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
        }
      }
    },
    quickSort: function(arr) {
      if (arr.length <= 1) {
        return arr;
      }
      const pivot = arr[arr.length - 1];
      const left = [];
      const right = [];
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
      }
      return [...sortingAlgorithms.quickSort(left), pivot, ...sortingAlgorithms.quickSort(right)];
    },
    insertionSort: function(arr) {
      for (let i = 1; i < arr.length; i++) {
        let currentValue = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > currentValue) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = currentValue;
      }
    },
    mergeSort: function(arr) {
      if (arr.length <= 1) {
        return arr;
      }
      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);
      return merge(sortingAlgorithms.mergeSort(left), sortingAlgorithms.mergeSort(right));
    }
  };

  // Merge helper function for merge sort
  const merge = (left, right) => {
    // Merge helper function implementation
  };

  // Kullanıcıdan dizi boyutunu güncelleyen fonksiyon
  const handleArraySizeChange = (e) => {
    setArraySize(parseInt(e.target.value));
  };

  // Checkbox değişikliğini işleyen fonksiyon
  const handleCheckboxChange = (e) => {
    const algorithm = e.target.value;
    if (e.target.checked) {
      setSelectedAlgorithms([...selectedAlgorithms, algorithm]);
    } else {
      setSelectedAlgorithms(selectedAlgorithms.filter(item => item !== algorithm));
    }
  };

  // Sıralama algoritmalarının performansını ölçen fonksiyon
  const measurePerformance = (algorithm, array) => {
    const start = performance.now();
    algorithm(array);
    const end = performance.now();
    return end - start;
  };

  // Performansı ölç ve grafiği güncelle
  useEffect(() => {
    const arrayToSort = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 1000));

    const newPerformanceData = {};
    for (const algorithmName in sortingAlgorithms) {
      if (selectedAlgorithms.includes(algorithmName)) {
        const algorithm = sortingAlgorithms[algorithmName];
        const timeTaken = measurePerformance(algorithm, [...arrayToSort]);
        newPerformanceData[algorithmName] = timeTaken;
      }
    }
    setPerformanceData(newPerformanceData);
  }, [arraySize, selectedAlgorithms]);

// Grafik oluştur
useEffect(() => {
    const ctx = document.getElementById('sortingPerformanceChart').getContext('2d');
    
    // Önceki Chart nesnesini kontrol et ve varsa yok et
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
  
    if (performanceData && Object.keys(performanceData).length > 0) {
      const chartData = {
        labels: ['Performans'],
        datasets: selectedAlgorithms.map((algorithm, index) => ({
          label: algorithm,
          backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
          borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
          borderWidth: 1,
          data: [performanceData[algorithm]],
        })),
      };
  
      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      });
    }
  }, [performanceData, selectedAlgorithms]);
  
  

  return (
    <div>
      <h2>Sıralama Algoritmalarının Performansı</h2>
      <div>
        <label htmlFor="arraySizeInput">Dizi Boyutu:</label>
        <input
          id="arraySizeInput"
          type="number"
          value={arraySize}
          onChange={handleArraySizeChange}
        />
      </div>
      <div>
        <label>Seçilen Algoritmalar:</label>
        {Object.keys(sortingAlgorithms).map((algorithmName, index) => (
          <div key={index}>
            <input
              type="checkbox"
              value={algorithmName}
              checked={selectedAlgorithms.includes(algorithmName)}
              onChange={handleCheckboxChange}
            />
            <label>{algorithmName}</label>
          </div>
        ))}
      </div>
      <canvas id="sortingPerformanceChart" width="200" height="100"></canvas>
    </div>
  );
}

export default SortingPerformanceChart;
