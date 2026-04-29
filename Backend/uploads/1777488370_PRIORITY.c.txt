#include <stdio.h>

int main()
{
    int n;

    printf("Enter number of processes: ");
    scanf("%d",&n);

    // Arrays storing process information

    int AT[n];      // Arrival Time
    int BT[n];      // Burst Time
    int P[n];       // Priority
    int CT[n];      // Completion Time
    int TAT[n];     // Turnaround Time
    int WT[n];      // Waiting Time
    int visited[n]; // whether process finished

    int i;

    // =============================
    // INPUT SECTION
    // =============================

    for(i=0;i<n;i++)
    {
        printf("Enter AT, BT and Priority for P%d: ",i+1);
        scanf("%d %d %d",&AT[i],&BT[i],&P[i]);

        /*
        visited = 0 means process not finished
        */

        visited[i] = 0;
    }

    int time = 0;      // current CPU time
    int completed = 0; // number of finished processes
    int min;           // index of highest priority process

    /*
    Keep scheduling until all processes complete
    */

    while(completed < n)
    {
        min = -1;

        /*
        Scan all processes to find
        the highest priority process
        */

        for(i=0;i<n;i++)
        {
            /*
            Process must satisfy two conditions

            1) It must have arrived
            2) It must not already be completed
            */

            if(AT[i] <= time && visited[i] == 0)
            {
                /*
                If no process selected yet
                OR
                current process has higher priority
                */

                if(min == -1 || P[i] < P[min])
                {
                    min = i;
                }
            }
        }

        /*
        If no process has arrived yet
        CPU remains idle
        */

        if(min == -1)
        {
            time++; // advance time
        }

        else
        {
            /*
            Execute selected process completely
            because algorithm is non-preemptive
            */

            time += BT[min];

            CT[min] = time;

            visited[min] = 1;

            completed++;
        }
    }

    float totalTAT = 0;
    float totalWT = 0;

    /*
    Calculate TAT and WT
    */

    for(i=0;i<n;i++)
    {
        TAT[i] = CT[i] - AT[i];

        WT[i] = TAT[i] - BT[i];

        totalTAT += TAT[i];
        totalWT += WT[i];
    }

    printf("\nAverage Turnaround Time = %.2f\n", totalTAT/n);
    printf("Average Waiting Time = %.2f\n", totalWT/n);

    return 0;
}
