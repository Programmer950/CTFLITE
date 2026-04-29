#include <stdio.h>

int main() {

    int p, r;   // p = number of processes, r = number of resource types
    int i, j, k;

    printf("Enter number of processes: ");
    scanf("%d", &p);

    printf("Enter number of resource types: ");
    scanf("%d", &r);

    /*
    Example:

    p = 3 processes
    r = 2 resources

    Processes:
    P0, P1, P2

    Resources:
    R0, R1
    */

    // ==============================
    // DECLARING MATRICES
    // ==============================

    int alloc[p][r];   // Allocation Matrix (resources currently allocated)
    int max[p][r];     // Max Matrix (maximum resources a process may need)
    int need[p][r];    // Need Matrix (remaining resources required)

    int avail[r];      // Available resources vector
    int work[r];       // Working copy of available resources

    int finish[p];     // Marks if process is finished
    int safeSeq[p];    // Stores safe sequence

    // ==============================
    // INPUT ALLOCATION MATRIX
    // ==============================

    printf("Enter Allocation Matrix:\n");

    /*
    Allocation Matrix represents
    how many resources are currently
    allocated to each process.

    Example:

        R0 R1
    P0  1  0
    P1  0  1
    P2  1  1
    */

    for(i = 0; i < p; i++)
        for(j = 0; j < r; j++)
            scanf("%d", &alloc[i][j]);

    // ==============================
    // INPUT MAX MATRIX
    // ==============================

    printf("Enter Max Matrix:\n");

    /*
    Max Matrix shows the maximum
    resources a process may require.

    Example:

        R0 R1
    P0  2  1
    P1  1  2
    P2  3  3
    */

    for(i = 0; i < p; i++)
        for(j = 0; j < r; j++)
            scanf("%d", &max[i][j]);

    // ==============================
    // INPUT AVAILABLE RESOURCES
    // ==============================

    printf("Enter Available Resources:\n");

    /*
    Available resources in system.

    Example:

    R0 = 1
    R1 = 1
    */

    for(i = 0; i < r; i++) {
        scanf("%d", &avail[i]);

        /*
        work[] is a temporary copy
        of available resources.

        It will change as processes
        finish execution.
        */

        work[i] = avail[i];
    }

    // ==============================
    // NEED MATRIX CALCULATION
    // ==============================

    /*
    Need Matrix tells how many
    more resources a process needs.

    Formula:

    Need = Max - Allocation

    Example:

    Max = 2 1
    Alloc = 1 0

    Need = 1 1
    */

    for(i = 0; i < p; i++)
        for(j = 0; j < r; j++)
            need[i][j] = max[i][j] - alloc[i][j];

    // ==============================
    // INITIALIZE FINISH ARRAY
    // ==============================

    /*
    finish[i] = 0 → process not finished
    finish[i] = 1 → process completed
    */

    for(i = 0; i < p; i++)
        finish[i] = 0;

    int count = 0;

    /*
    count keeps track of
    how many processes finished
    */

    // ==============================
    // BANKER'S ALGORITHM LOGIC
    // ==============================

    while(count < p) {

        int found = 0;

        /*
        found = 1 if a process
        can execute in this round
        */

        for(i = 0; i < p; i++) {

            if(finish[i] == 0) {

                int possible = 1;

                /*
                Check if process i can execute

                Condition:
                Need[i] ≤ Available(work)
                */

                for(j = 0; j < r; j++) {

                    if(need[i][j] > work[j]) {
                        possible = 0;
                        break;
                    }

                }

                // ==============================
                // PROCESS CAN EXECUTE
                // ==============================

                if(possible) {

                    /*
                    If process executes successfully,
                    it releases its allocated resources.

                    So we add its allocation
                    back to available resources.
                    */

                    for(k = 0; k < r; k++)
                        work[k] += alloc[i][k];

                    /*
                    Store process in safe sequence
                    */

                    safeSeq[count++] = i;

                    finish[i] = 1;

                    found = 1;
                }
            }
        }

        /*
        If no process could execute
        in this entire round,
        system is NOT safe
        */

        if(!found)
            break;
    }

    // ==============================
    // SAFE STATE CHECK
    // ==============================

    if(count == p) {

        /*
        All processes finished
        → SAFE STATE
        */

        printf("System is in a SAFE STATE.\n");

        printf("Safe Sequence: ");

        for(i = 0; i < p; i++)
            printf("P%d ", safeSeq[i]);
    }

    else {

        /*
        Some processes could not finish
        → NOT SAFE (deadlock possible)
        */

        printf("System is NOT in a safe state (Deadlock may occur).\n");
    }

    return 0;
}