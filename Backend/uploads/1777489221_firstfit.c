#include <stdio.h>

int main() {
    int m, n;

    scanf("%d", &m);

    int blockSize[m], originalBlockSize[m];

    for(int i = 0; i < m; i++) {
        scanf("%d", &blockSize[i]);
        originalBlockSize[i] = blockSize[i];
    }

    scanf("%d", &n);

    int processSize[n];

    for(int i = 0; i < n; i++) {
        scanf("%d", &processSize[i]);
    }

    for(int i = 0; i < n; i++) {
        int allocated = 0;

        for(int j = 0; j < m; j++) {
            if(blockSize[j] >= processSize[i]) {
                int fragment = blockSize[j] - processSize[i];

                printf("Process %d of size %d is allocated to Block %d of size %d with Fragment %d\n",
                       i + 1, processSize[i], j + 1,
                       originalBlockSize[j], fragment);

                blockSize[j] -= processSize[i];
                allocated = 1;
                break;
            }
        }

        if(!allocated) {
            printf("Process %d of size %d is not allocated\n",
                   i + 1, processSize[i]);
        }
    }

    return 0;
}
