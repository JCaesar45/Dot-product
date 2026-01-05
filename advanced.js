/**
 * VectorCalc Pro - Advanced Dot Product Calculator
 * A comprehensive, interactive web application for vector calculations
 * Author: Advanced Developer
 * Version: 1.0.0
 */

class VectorCalcPro {
    constructor() {
        this.currentDimension = 3;
        this.history = JSON.parse(localStorage.getItem('vectorCalcHistory') || '[]');
        this.isAutoRotating = true;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.vectorObjects = {};
        
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupCalculator();
        this.setupVisualizer();
        this.setupHistory();
        this.setupEventListeners();
        
        // Initialize on load
        window.addEventListener('load', () => {
            setTimeout(() => this.hideLoadingScreen(), 1500);
        });
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.querySelector('.loading-progress');
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
            }
        }, 200);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        
        this.setTheme(savedTheme);
        
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.checked = theme === 'light';
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
                
                // Update active button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchView(viewName) {
        const views = document.querySelectorAll('.view');
        views.forEach(view => view.classList.remove('active'));
        
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            
            // Initialize view-specific features
            if (viewName === 'visualizer') {
                this.initThreeJS();
            } else if (viewName === 'history') {
                this.renderHistory();
            }
        }
    }

    setupCalculator() {
        this.setupDimensionButtons();
        this.setupQuickFillButtons();
        this.setupActionButtons();
        this.setupInputValidation();
    }

    setupDimensionButtons() {
        const dimButtons = document.querySelectorAll('.dim-btn');
        
        dimButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const dimension = parseInt(btn.dataset.dim);
                this.setDimension(dimension);
                
                // Update active button
                dimButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setDimension(dimension) {
        this.currentDimension = dimension;
        
        // Update dimension badges
        document.querySelectorAll('.dimension-badge').forEach(badge => {
            badge.textContent = `${dimension}D`;
        });
        
        // Update placeholder text
        const placeholders = {
            2: '1, 3',
            3: '1, 3, -5',
            4: '1, 3, -5, 2',
            5: '1, 3, -5, 2, 4'
        };
        
        document.getElementById('vectorA').placeholder = placeholders[dimension];
        document.getElementById('vectorB').placeholder = placeholders[dimension];
    }

    setupQuickFillButtons() {
        const quickFillButtons = document.querySelectorAll('.quick-fill-btn');
        
        quickFillButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const vector = btn.dataset.vector;
                const values = btn.dataset.values;
                
                if (vector === 'A') {
                    document.getElementById('vectorA').value = values;
                } else {
                    document.getElementById('vectorB').value = values;
                }
                
                // Add animation effect
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    setupActionButtons() {
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateDotProduct();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearInputs();
        });

        document.getElementById('swapBtn').addEventListener('click', () => {
            this.swapVectors();
        });
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('.vector-input');
        
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateDotProduct();
                }
            });
        });
    }

    validateInput(input) {
        const value = input.value;
        const sanitized = value.replace(/[^0-9,\s.-]/g, '');
        
        if (value !== sanitized) {
            input.value = sanitized;
        }
        
        // Real-time validation feedback
        const isValid = this.isValidVectorInput(input.value);
        input.style.borderColor = isValid ? 'var(--accent-success)' : 'var(--accent-error)';
    }

    isValidVectorInput(value) {
        if (!value.trim()) return true;
        
        const numbers = value.split(',').map(v => v.trim());
        return numbers.every(num => !isNaN(parseFloat(num)) && isFinite(num));
    }

    calculateDotProduct() {
        const vectorAInput = document.getElementById('vectorA').value.trim();
        const vectorBInput = document.getElementById('vectorB').value.trim();
        
        if (!vectorAInput || !vectorBInput) {
            this.showError('Please enter both vectors');
            return;
        }
        
        try {
            const vectorA = this.parseVector(vectorAInput);
            const vectorB = this.parseVector(vectorBInput);
            
            if (vectorA.length !== vectorB.length) {
                this.showError('Vectors must have the same dimension');
                return;
            }
            
            if (vectorA.length !== this.currentDimension) {
                this.showError(`Please enter ${this.currentDimension}D vectors`);
                return;
            }
            
            const result = this.computeDotProduct(vectorA, vectorB);
            this.displayResult(vectorA, vectorB, result);
            this.showCalculationSteps(vectorA, vectorB, result);
            this.addToHistory(vectorA, vectorB, result);
            this.updateVisualizer(vectorA, vectorB);
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    parseVector(input) {
        return input.split(',').map(val => {
            const num = parseFloat(val.trim());
            if (isNaN(num)) throw new Error(`Invalid number: ${val.trim()}`);
            return num;
        });
    }

    computeDotProduct(vectorA, vectorB) {
        return vectorA.reduce((sum, val, index) => sum + val * vectorB[index], 0);
    }

    displayResult(vectorA, vectorB, result) {
        const resultDisplay = document.getElementById('resultDisplay');
        
        resultDisplay.innerHTML = `
            <div class="result-content">
                <div class="result-value">${result}</div>
                <div class="result-label">Dot Product</div>
                <div class="result-details">
                    ${vectorA.join(' · ')} · ${vectorB.join(' · ')} = ${result}
                </div>
            </div>
        `;
        
        // Add success animation
        resultDisplay.style.animation = 'none';
        setTimeout(() => {
            resultDisplay.style.animation = 'resultAppear 0.5s ease';
        }, 10);
    }

    showCalculationSteps(vectorA, vectorB, result) {
        const stepsContainer = document.getElementById('calculationSteps');
        const steps = [];
        
        // Step 1: Show the formula
        steps.push({
            number: 1,
            content: `Formula: A · B = Σ(Ai × Bi)`
        });
        
        // Step 2: Show the multiplication
        const multiplications = vectorA.map((val, index) => `${val} × ${vectorB[index]}`);
        steps.push({
            number: 2,
            content: `Multiply corresponding components: ${multiplications.join(' + ')}`
        });
        
        // Step 3: Show the products
        const products = vectorA.map((val, index) => val * vectorB[index]);
        steps.push({
            number: 3,
            content: `Calculate products: ${products.join(' + ')}`
        });
        
        // Step 4: Show the sum
        steps.push({
            number: 4,
            content: `Sum the products: ${products.join(' + ')} = <span class="step-result">${result}</span>`
        });
        
        stepsContainer.innerHTML = steps.map(step => `
            <div class="step">
                <div class="step-number">${step.number}</div>
                <div class="step-content">${step.content}</div>
            </div>
        `).join('');
    }

    showError(message) {
        const resultDisplay = document.getElementById('resultDisplay');
        
        resultDisplay.innerHTML = `
            <div class="result-content error">
                <i class="fas fa-exclamation-triangle" style="color: var(--accent-error); font-size: 2rem; margin-bottom: var(--spacing-sm);"></i>
                <div class="result-label" style="color: var(--accent-error);">${message}</div>
            </div>
        `;
        
        // Shake animation
        resultDisplay.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            resultDisplay.style.animation = '';
        }, 500);
    }

    clearInputs() {
        document.getElementById('vectorA').value = '';
        document.getElementById('vectorB').value = '';
        document.getElementById('resultDisplay').innerHTML = `
            <div class="result-placeholder">
                <i class="fas fa-calculator"></i>
                <p>Enter vectors and click calculate</p>
            </div>
        `;
        document.getElementById('calculationSteps').innerHTML = '';
        
        // Reset input borders
        document.querySelectorAll('.vector-input').forEach(input => {
            input.style.borderColor = 'transparent';
        });
    }

    swapVectors() {
        const vectorA = document.getElementById('vectorA');
        const vectorB = document.getElementById('vectorB');
        
        const temp = vectorA.value;
        vectorA.value = vectorB.value;
        vectorB.value = temp;
        
        // Add swap animation
        [vectorA, vectorB].forEach(input => {
            input.style.transform = 'scale(0.95)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
            }, 200);
        });
    }

    addToHistory(vectorA, vectorB, result) {
        const historyItem = {
            id: Date.now(),
            vectorA: vectorA,
            vectorB: vectorB,
            result: result,
            timestamp: new Date().toISOString(),
            dimension: vectorA.length
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        localStorage.setItem('vectorCalcHistory', JSON.stringify(this.history));
    }

    setupVisualizer() {
        this.setupCanvasControls();
    }

    setupCanvasControls() {
        document.getElementById('resetView').addEventListener('click', () => {
            this.resetCamera();
        });

        document.getElementById('toggleGrid').addEventListener('click', () => {
            this.toggleGrid();
        });

        document.getElementById('autoRotate').addEventListener('change', (e) => {
            this.isAutoRotating = e.target.checked;
        });
    }

    initThreeJS() {
        if (this.scene) return; // Already initialized
        
        const canvas = document.getElementById('vectorCanvas');
        const container = canvas.parentElement;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add grid
        this.addGrid();
        
        // Add axes
        this.addAxes();
        
        // Add lighting
        this.addLighting();
        
        // Start animation loop
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    addGrid() {
        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        this.scene.add(gridHelper);
        this.gridHelper = gridHelper;
    }

    addAxes() {
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    updateVisualizer(vectorA, vectorB) {
        if (!this.scene) return;
        
        // Clear existing vectors
        this.clearVectors();
        
        // Create vector objects
        this.createVector('A', vectorA, 0x00d4ff);
        this.createVector('B', vectorB, 0xff00ff);
        
        // Create projection visualization
        this.createProjection(vectorA, vectorB);
    }

    createVector(name, vector, color) {
        const origin = new THREE.Vector3(0, 0, 0);
        const direction = new THREE.Vector3(
            vector[0] || 0,
            vector[1] || 0,
            vector[2] || 0
        );
        
        // Arrow helper
        const arrowHelper = new THREE.ArrowHelper(
            direction.normalize(),
            origin,
            direction.length() * 0.5,
            color,
            direction.length() * 0.1,
            direction.length() * 0.05
        );
        
        this.scene.add(arrowHelper);
        this.vectorObjects[name] = arrowHelper;
        
        // Add label
        this.createLabel(name, direction, color);
    }

    createProjection(vectorA, vectorB) {
        // Calculate projection for visualization
        const dotProduct = this.computeDotProduct(vectorA, vectorB);
        const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
        
        if (magnitudeB === 0) return;
        
        const projectionLength = dotProduct / magnitudeB;
        const projectionVector = vectorB.map(val => val * projectionLength / magnitudeB);
        
        this.createVector('Projection', projectionVector, 0x00ff88);
    }

    createLabel(text, position, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(text, 64, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.copy(position);
        sprite.scale.set(1, 0.5, 1);
        
        this.scene.add(sprite);
    }

    clearVectors() {
        Object.keys(this.vectorObjects).forEach(key => {
            this.scene.remove(this.vectorObjects[key]);
            delete this.vectorObjects[key];
        });
    }

    animate() {
        if (!this.scene) return;
        
        requestAnimationFrame(() => this.animate());
        
        if (this.isAutoRotating) {
            this.scene.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    resetCamera() {
        if (!this.camera) return;
        
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
    }

    toggleGrid() {
        if (!this.gridHelper) return;
        
        this.gridHelper.visible = !this.gridHelper.visible;
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        const container = this.renderer.domElement.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    setupHistory() {
        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });

        document.getElementById('exportHistory').addEventListener('click', () => {
            this.exportHistory();
        });
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-history" style="font-size: 3rem; opacity: 0.5; margin-bottom: var(--spacing-md);"></i>
                    <p>No calculations yet. Start calculating!</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="history-item-content">
                    <div class="history-vectors">
                        [${item.vectorA.join(', ')}] · [${item.vectorB.join(', ')}]
                    </div>
                    <div class="history-time">
                        ${new Date(item.timestamp).toLocaleString()}
                    </div>
                </div>
                <div class="history-result">${item.result}</div>
            </div>
        `).join('');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            this.history = [];
            localStorage.removeItem('vectorCalcHistory');
            this.renderHistory();
        }
    }

    exportHistory() {
        if (this.history.length === 0) {
            alert('No history to export');
            return;
        }
        
        const csvContent = [
            ['Vector A', 'Vector B', 'Result', 'Dimension', 'Timestamp'],
            ...this.history.map(item => [
                `[${item.vectorA.join(', ')}]`,
                `[${item.vectorB.join(', ')}]`,
                item.result,
                item.dimension,
                new Date(item.timestamp).toLocaleString()
            ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vectorcalc_history_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.calculateDotProduct();
                        break;
                    case 'Delete':
                        e.preventDefault();
                        this.clearInputs();
                        break;
                }
            }
        });
        
        // Add shake animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application
const app = new VectorCalcPro();

// Add some advanced features
class AdvancedFeatures {
    constructor(vectorCalcApp) {
        this.app = vectorCalcApp;
        this.setupAdvancedFeatures();
    }

    setupAdvancedFeatures() {
        this.addKeyboardShortcuts();
        this.addContextMenu();
        this.addDragAndDrop();
        this.addVoiceRecognition();
    }

    addKeyboardShortcuts() {
        // Add more advanced shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.app.setDimension(2);
                        break;
                    case '2':
                        e.preventDefault();
                        this.app.setDimension(3);
                        break;
                    case '3':
                        e.preventDefault();
                        this.app.setDimension(4);
                        break;
                    case '4':
                        e.preventDefault();
                        this.app.setDimension(5);
                        break;
                }
            }
        });
    }

    addContextMenu() {
        // Custom context menu for inputs
        const inputs = document.querySelectorAll('.vector-input');
        
        inputs.forEach(input => {
            input.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showContextMenu(e, input);
            });
        });
    }

    showContextMenu(event, input) {
        // Remove existing menu
        const existingMenu = document.querySelector('.custom-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.className = 'custom-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: var(--bg-card);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            padding: var(--spacing-sm);
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
        `;
        
        menu.innerHTML = `
            <button class="context-menu-item" onclick="navigator.clipboard.readText().then(text => {
                const input = document.querySelector('.vector-input:focus');
                if (input) input.value = text;
            })">
                <i class="fas fa-paste"></i> Paste
            </button>
            <button class="context-menu-item" onclick="navigator.clipboard.writeText(document.querySelector('.vector-input:focus').value)">
                <i class="fas fa-copy"></i> Copy
            </button>
        `;
        
        document.body.appendChild(menu);
        
        // Remove menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            });
        }, 100);
    }

    addDragAndDrop() {
        const inputs = document.querySelectorAll('.vector-input');
        
        inputs.forEach(input => {
            input.addEventListener('dragover', (e) => {
                e.preventDefault();
                input.style.borderColor = 'var(--accent-primary)';
            });
            
            input.addEventListener('dragleave', (e) => {
                e.preventDefault();
                input.style.borderColor = 'transparent';
            });
            
            input.addEventListener('drop', (e) => {
                e.preventDefault();
                input.style.borderColor = 'transparent';
                
                const text = e.dataTransfer.getData('text');
                if (text) {
                    input.value = text;
                    this.app.validateInput(input);
                }
            });
        });
    }

    addVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            // Add voice input button
            const voiceButton = document.createElement('button');
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.className = 'voice-input-btn';
            voiceButton.title = 'Voice Input';
            
            document.querySelector('.vector-input-container').appendChild(voiceButton);
            
            voiceButton.addEventListener('click', () => {
                recognition.start();
                voiceButton.classList.add('recording');
            });
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
                voiceButton.classList.remove('recording');
            };
            
            recognition.onerror = () => {
                voiceButton.classList.remove('recording');
            };
        }
    }

    processVoiceInput(transcript) {
        // Simple voice parsing - can be enhanced with NLP
        const numbers = transcript.match(/-?\d+/g);
        if (numbers) {
            const activeInput = document.activeElement;
            if (activeInput && activeInput.classList.contains('vector-input')) {
                activeInput.value = numbers.slice(0, this.app.currentDimension).join(', ');
            }
        }
    }
}

// Initialize advanced features
const advancedFeatures = new AdvancedFeatures(app);

// Export for global access
window.VectorCalcPro = VectorCalcPro;
window.vectorCalcApp = app;

console.log('%c VectorCalc Pro v1.0.0 ', 'background: linear-gradient(135deg, #00d4ff, #ff00ff); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c Advanced Dot Product Calculator Loaded Successfully! ', 'color: #00ff88; font-size: 14px;');
console.log('%c Features: 3D Visualization • Voice Input • Drag & Drop • Keyboard Shortcuts • History Export ', 'color: #b0b0b0; font-size: 12px;');
