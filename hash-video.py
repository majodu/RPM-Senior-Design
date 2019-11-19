import hashlib
import sys
import select
import tty
import termios
import picamera
import os
import glob

def isData():
    return select.select([sys.stdin], [], [], 0) == ([sys.stdin], [], [])

# delete old files for testing
old_files = glob.glob('*.h264')
print('deleting old videos...')
for f in old_files:
    os.remove(f)
print('done')

old_settings = termios.tcgetattr(sys.stdin)
camera = picamera.PiCamera(resolution=(640, 480))
camera.start_recording('0.h264')
print('started recording')
i = 1
a = 0
try:
    tty.setcbreak(sys.stdin.fileno())
    while 1:
        c = ""
        if a < 5:
            camera.wait_recording(1)
            if isData():
                c = sys.stdin.read(1)
                if c == '\x1b':         # x1b is ESC
                    print("exiting...")
                    break
            a += 1
        else:
            a = 0
            camera.split_recording('%d.h264' % i)
            print(hashlib.sha1(open('%d.h264' % (i-1),'rb').read()).hexdigest())
            i += 1
            
finally:
    camera.stop_recording()
    termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)
