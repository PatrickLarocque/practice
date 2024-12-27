import {AfterViewInit, Component, linkedSignal, OnInit, signal, WritableSignal} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TopNavComponent} from './components/layout/top-nav/top-nav.component';
import {NgTemplateOutlet} from '@angular/common';

interface LinkedTreeNode {
  name: string;
  isExpanded: WritableSignal<boolean>;
  parent?: LinkedTreeNode;
  children: LinkedTreeNode[];
  depth: number;
}

interface ManualTreeNode {
  name: string;
  isExpanded: WritableSignal<boolean>;
  parent?: ManualTreeNode;
  children: ManualTreeNode[];
  depth: number;
}

interface FlatNode {
  id: number;
  name: string;
  level: number;
  isExpanded: WritableSignal<boolean>;
  parentId?: number;
  hasChildren?: boolean;
}



@Component({
    selector: 'app-root',
  imports: [MatToolbarModule, MatCard, MatCardContent, TopNavComponent, NgTemplateOutlet],
    template: `
    <app-top-nav />
    <mat-card>
      <mat-card-content>
        <div class="container">
          <button class="benchmark-btn" (click)="benchmark()">Run Benchmark</button>

          <div class="trees-container">
            <!-- Linked Signal Tree -->
            <div id="linked-tree" class="tree-section">
              <div class="tree-header">
                <h3>Linked Signal Tree</h3>
                <button (click)="expandAllLinked()">
                  {{ expanded() ? 'Collapse All' : 'Expand All' }}
                </button>
              </div>
              <div class="nodes">
                @for (node of linkedSignalNodes; track node) {
                  <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: node }">
                  </ng-container>
                }
              </div>
            </div>

            <!-- Manual Signal Tree -->
            <div id="manual-tree" class="tree-section">
              <div class="tree-header">
                <h3>Manual Signal Tree</h3>
                <button (click)="expandAllManual()">
                  {{ manualExpanded() ? 'Collapse All' : 'Expand All' }}
                </button>
              </div>
              <div class="nodes">
                @for (node of manualNodes; track node) {
                  <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: node }">
                  </ng-container>
                }
              </div>
            </div>

            <div id="flat-tree" class="tree-section">
              <div class="tree-header">
                <h3>Flat Tree</h3>
                <button (click)="expandAllFlat()">
                  {{ flatExpanded() ? 'Collapse All' : 'Expand All' }}
                </button>
              </div>
              <div class="nodes">
                @for (node of getVisibleNodes(); track node) {
                  <div [style.padding-left.px]="node.level * 20">
                    <button (click)="node.isExpanded.set(!node.isExpanded())">
                      {{node.isExpanded() ? '▼' : '▶'}} {{node.name}}
                    </button>
                  </div>
                }
              </div>
            </div>


          </div>
        </div>

        <ng-template #nodeTemplate let-node>
          <div class="node-item">
            <button (click)="node.isExpanded.set(!node.isExpanded())">
              {{node.isExpanded() ? '▼' : '▶'}} {{node.name}}
            </button>

            @if (node.isExpanded()) {
              <div class="children">
                @for (child of node.children; track child) {
                  <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: child }">
                  </ng-container>
                }
              </div>
            }
          </div>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .container { padding: 20px; }
    .trees-container {
      display: flex;
      gap: 20px;
    }
    .tree-section {
      width: 50%;
      border: 1px solid #ccc;
      padding: 15px;
    }
    .tree-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .benchmark-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .children {
      padding-left: 20px;
    }
    button {
      padding: 5px 10px;
      margin: 2px;
    }
  `
})
export class AppComponent implements OnInit {

  expanded = signal(false);
  manualExpanded = signal(false);
  nodeCount = 0;
  linkedSignalNodes: LinkedTreeNode[] = [];
  manualNodes: ManualTreeNode[] = [];
  flatNodes: FlatNode[] = [];
  flatExpanded = signal(false);


  ngOnInit() {
    this.linkedSignalNodes = Array(100).fill(null).map(() => this.createLinkedNode());
    this.manualNodes = Array(100).fill(null).map(() => this.createManualNode());
    this.loadLinkedChildren(this.linkedSignalNodes);
    this.loadManualChildren(this.manualNodes);
    this.flatNodes = this.createFlatTree();
  }

  createFlatTree() {
    const nodes: FlatNode[] = [];
    let id = 0;

    const flattenNode = (level: number, parentId?: number) => {
      const node: FlatNode = {
        id: id++,
        name: `Node #${id}`,
        level,
        isExpanded: signal(false),
        parentId,
        hasChildren: level < 3
      };
      nodes.push(node);

      if (level < 3) {
        for (let i = 0; i < 3; i++) {
          flattenNode(level + 1, node.id);
        }
      }
    };

    // Create 100 root nodes with children
    for (let i = 0; i < 100; i++) {
      flattenNode(0);
    }

    return nodes;
  }

  getVisibleNodes() {
    return this.flatNodes.filter(node =>
      !node.parentId ||
      this.flatNodes.find(n => n.id === node.parentId)?.isExpanded()
    );
  }

  expandAllFlat() {
    const newValue = !this.flatExpanded();
    this.flatExpanded.set(newValue);
    queueMicrotask(() => {
      this.flatNodes.forEach(node => node.isExpanded.set(newValue));
    });
  }

  createLinkedNode(parent?: LinkedTreeNode): LinkedTreeNode {
    return {
      name: `Node #${++this.nodeCount}`,
      isExpanded: linkedSignal(() => this.expanded()),
      parent,
      children: [],
      depth: parent ? parent.depth + 1 : 0
    }
  }

  loadLinkedChildren(nodes: LinkedTreeNode[]) {
    nodes.forEach(node => {
      if (node.depth < 3) {
        const children = Array(3).fill(null).map(() => this.createLinkedNode(node));
        node.children = children;
        this.loadLinkedChildren(children);
      }
    });
  }


  createManualNode(parent?: ManualTreeNode): ManualTreeNode {
    return {
      name: `Node #${++this.nodeCount}`,
      isExpanded: signal(false),
      parent,
      children: [],
      depth: parent ? parent.depth + 1 : 0
    }
  }

  loadManualChildren(nodes: ManualTreeNode[]) {
    nodes.forEach(node => {
      if (node.depth < 3) {
        const children = Array(3).fill(null).map(() => this.createManualNode(node));
        node.children = children;
        this.loadManualChildren(children);
      }
    });
  }

  expandAllManual() {
    const newValue = !this.manualExpanded();
    this.manualExpanded.set(newValue);
    this.setAllExpanded(this.manualNodes, newValue);
  }

  setAllExpanded(nodes: ManualTreeNode[], value: boolean) {
    queueMicrotask(() => {
      const updateNodes = (nodes: ManualTreeNode[]) => {
        nodes.forEach(node => {
          node.isExpanded.set(value);
          updateNodes(node.children);
        });
      };
      updateNodes(nodes);
    });
  }

  expandAllLinked() {
    this.expanded.set(!this.expanded());
  }

  async benchmark() {
    const measureRender = async (treeId: string, fn: () => void) => {
      return new Promise<number>(resolve => {
        let timeout: any;
        const start = performance.now();

        const observer = new MutationObserver(() => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            observer.disconnect();
            resolve(performance.now() - start);
          }, 100);
        });

        observer.observe(document.getElementById(treeId)!, {
          childList: true,
          subtree: true,
          attributes: true
        });

        fn();
      });
    };

    const linkedTime = await measureRender('linked-tree', () => this.expandAllLinked());
    console.log(`Linked tree render: ${linkedTime}ms`);

    await new Promise(r => setTimeout(r, 1000));

    const manualTime = await measureRender('manual-tree', () => this.expandAllManual());
    console.log(`Manual tree render: ${manualTime}ms`);

    await new Promise(r => setTimeout(r, 1000));

    const flatTime = await measureRender('flat-tree', () => this.expandAllFlat());
    console.log(`Flat tree render: ${flatTime}ms`);
  }
}
